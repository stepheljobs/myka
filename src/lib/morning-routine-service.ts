import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  MorningRoutineConfig, 
  MorningTask, 
  WeightEntry, 
  WaterEntry, 
  DailyProgress,
  WeightStats,
  WaterStats,
  DailyWeightSummary,
  WeightTrendData
} from '@/types';

export class MorningRoutineService {
  // Morning Routine Configuration
  static async getRoutineConfig(userId: string): Promise<MorningRoutineConfig | null> {
    try {
      const configRef = collection(db, 'morningRoutines');
      const q = query(configRef, where('userId', '==', userId), limit(1));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        userId: data.userId,
        wakeUpTime: data.wakeUpTime,
        enabled: data.enabled,
        tasks: data.tasks || [],
        notificationSettings: data.notificationSettings,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error getting routine config:', error);
      throw error;
    }
  }

  static async createRoutineConfig(config: Omit<MorningRoutineConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const configRef = collection(db, 'morningRoutines');
      const docRef = await addDoc(configRef, {
        ...config,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating routine config:', error);
      throw error;
    }
  }

  static async updateRoutineConfig(configId: string, updates: Partial<MorningRoutineConfig>): Promise<void> {
    try {
      const configRef = doc(db, 'morningRoutines', configId);
      await updateDoc(configRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating routine config:', error);
      throw error;
    }
  }

  // Weight Tracking
  static async logWeight(entry: Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const weightRef = collection(db, 'weightEntries');
      const docRef = await addDoc(weightRef, {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging weight:', error);
      throw error;
    }
  }

  static async getWeightHistory(userId: string, limitCount: number = 30): Promise<WeightEntry[]> {
    try {
      const weightRef = collection(db, 'weightEntries');
      const q = query(
        weightRef, 
        where('userId', '==', userId), 
        orderBy('date', 'desc'), 
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          weight: data.weight,
          unit: data.unit,
          date: data.date?.toDate() || new Date(),
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error getting weight history:', error);
      throw error;
    }
  }

  static async getWeightStats(userId: string): Promise<WeightStats> {
    try {
      const history = await this.getWeightHistory(userId, 365);
      
      if (history.length === 0) {
        return {
          currentWeight: 0,
          startingWeight: 0,
          totalChange: 0,
          weeklyChange: 0,
          monthlyChange: 0,
          streakDays: 0,
          averageWeeklyWeight: 0,
          consistencyScore: 0
        };
      }

      const sortedHistory = history.sort((a, b) => a.date.getTime() - b.date.getTime());
      const currentWeight = sortedHistory[sortedHistory.length - 1].weight;
      const startingWeight = sortedHistory[0].weight;
      
      // Calculate weekly change
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoEntry = sortedHistory.find(entry => entry.date >= weekAgo);
      const weeklyChange = weekAgoEntry ? currentWeight - weekAgoEntry.weight : 0;
      
      // Calculate monthly change
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthAgoEntry = sortedHistory.find(entry => entry.date >= monthAgo);
      const monthlyChange = monthAgoEntry ? currentWeight - monthAgoEntry.weight : 0;
      
      // Calculate streak
      let streakDays = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const hasEntry = sortedHistory.some(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === checkDate.getTime();
        });
        
        if (hasEntry) {
          streakDays++;
        } else {
          break;
        }
      }

      // Calculate average weekly weight and consistency score
      const lastWeekEntries = sortedHistory.filter(entry => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entry.date >= weekAgo;
      });
      
      const averageWeeklyWeight = lastWeekEntries.length > 0 
        ? lastWeekEntries.reduce((sum, entry) => sum + entry.weight, 0) / lastWeekEntries.length 
        : currentWeight;
      
      // Calculate consistency score (percentage of days with entries in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentEntries = sortedHistory.filter(entry => entry.date >= thirtyDaysAgo);
      const consistencyScore = Math.round((recentEntries.length / 30) * 100);

      return {
        currentWeight,
        startingWeight,
        totalChange: currentWeight - startingWeight,
        weeklyChange,
        monthlyChange,
        streakDays,
        averageWeeklyWeight,
        consistencyScore
      };
    } catch (error) {
      console.error('Error getting weight stats:', error);
      throw error;
    }
  }

  // Enhanced Weight Tracking Methods
  static async getDailyWeightSummary(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<DailyWeightSummary[]> {
    try {
      const weightRef = collection(db, 'weightEntries');
      const q = query(
        weightRef,
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const entries = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          weight: data.weight,
          unit: data.unit,
          date: data.date?.toDate() || new Date(),
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });

      // Create daily summary for each day in the range
      const summary: DailyWeightSummary[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayEntry = entries.find(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.toISOString().split('T')[0] === dateString;
        });

        summary.push({
          date: dateString,
          weight: dayEntry?.weight,
          unit: dayEntry?.unit || 'kg',
          hasEntry: !!dayEntry,
          dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
          weekNumber: this.getISOWeekNumber(currentDate),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return summary;
    } catch (error) {
      console.error('Error getting daily weight summary:', error);
      throw error;
    }
  }

  static async getWeightTrend(
    userId: string, 
    period: '7d' | '14d' | '30d' | '90d',
    startDate?: Date
  ): Promise<WeightTrendData> {
    try {
      const endDate = startDate || new Date();
      const startDateCalc = new Date(endDate);
      
      switch (period) {
        case '7d':
          startDateCalc.setDate(startDateCalc.getDate() - 7);
          break;
        case '14d':
          startDateCalc.setDate(startDateCalc.getDate() - 14);
          break;
        case '30d':
          startDateCalc.setDate(startDateCalc.getDate() - 30);
          break;
        case '90d':
          startDateCalc.setDate(startDateCalc.getDate() - 90);
          break;
      }

      const data = await this.getDailyWeightSummary(userId, startDateCalc, endDate);
      
      // Calculate statistics
      const entriesWithWeight = data.filter(day => day.hasEntry && day.weight !== undefined);
      const weights = entriesWithWeight.map(day => day.weight!);
      
      if (weights.length === 0) {
        return {
          period,
          data,
          statistics: {
            averageWeight: 0,
            trendDirection: 'stable',
            trendPercentage: 0,
            highestWeight: 0,
            lowestWeight: 0,
            totalEntries: 0
          }
        };
      }

      const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
      const highestWeight = Math.max(...weights);
      const lowestWeight = Math.min(...weights);
      
      // Calculate trend direction and percentage
      let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
      let trendPercentage = 0;
      
      if (weights.length >= 2) {
        const firstWeight = weights[0];
        const lastWeight = weights[weights.length - 1];
        const change = lastWeight - firstWeight;
        trendPercentage = (change / firstWeight) * 100;
        
        if (Math.abs(trendPercentage) < 0.5) {
          trendDirection = 'stable';
        } else {
          trendDirection = trendPercentage > 0 ? 'increasing' : 'decreasing';
        }
      }

      return {
        period,
        data,
        statistics: {
          averageWeight,
          trendDirection,
          trendPercentage,
          highestWeight,
          lowestWeight,
          totalEntries: entriesWithWeight.length
        }
      };
    } catch (error) {
      console.error('Error getting weight trend:', error);
      throw error;
    }
  }

  static async getWeightForDate(
    userId: string, 
    date: Date
  ): Promise<WeightEntry | null> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const weightRef = collection(db, 'weightEntries');
      const q = query(
        weightRef,
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay)),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        userId: data.userId,
        weight: data.weight,
        unit: data.unit,
        date: data.date?.toDate() || new Date(),
        notes: data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error getting weight for date:', error);
      throw error;
    }
  }

  static async getEnhancedWeightStats(userId: string): Promise<WeightStats> {
    try {
      const basicStats = await this.getWeightStats(userId);
      
      // Get today's and yesterday's weight
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayEntry = await this.getWeightForDate(userId, today);
      const yesterdayEntry = await this.getWeightForDate(userId, yesterday);
      
      // Get weekly trend for enhanced stats
      const weeklyTrend = await this.getWeightTrend(userId, '7d');
      
      return {
        ...basicStats,
        todayWeight: todayEntry?.weight,
        yesterdayWeight: yesterdayEntry?.weight,
        lastEntryDate: todayEntry?.date || yesterdayEntry?.date,
        averageWeeklyWeight: weeklyTrend.statistics.averageWeight
      };
    } catch (error) {
      console.error('Error getting enhanced weight stats:', error);
      throw error;
    }
  }

  // Helper method to get ISO week number
  private static getISOWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  }

  // Water Tracking
  static async logWater(entry: Omit<WaterEntry, 'id' | 'createdAt'>): Promise<string> {
    try {
      const waterRef = collection(db, 'waterEntries');
      const docRef = await addDoc(waterRef, {
        ...entry,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error logging water:', error);
      throw error;
    }
  }

  static async getTodayWaterIntake(userId: string): Promise<WaterEntry[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const waterRef = collection(db, 'waterEntries');
      const q = query(
        waterRef,
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(today)),
        where('date', '<', Timestamp.fromDate(tomorrow))
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          amount: data.amount,
          date: data.date?.toDate() || new Date(),
          time: data.time?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error getting today water intake:', error);
      throw error;
    }
  }

  static async getWaterStats(userId: string, dailyGoal: number = 2000): Promise<WaterStats> {
    try {
      const todayEntries = await this.getTodayWaterIntake(userId);
      const currentIntake = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
      
      // Get last 7 days for average calculation
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const waterRef = collection(db, 'waterEntries');
      const q = query(
        waterRef,
        where('userId', '==', userId),
        where('date', '>=', Timestamp.fromDate(weekAgo))
      );
      const snapshot = await getDocs(q);
      
      const weeklyEntries = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          amount: data.amount,
          date: data.date?.toDate() || new Date(),
          time: data.time?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        };
      });

      // Group by date and calculate daily averages
      const dailyTotals = new Map<string, number>();
      weeklyEntries.forEach(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        dailyTotals.set(dateKey, (dailyTotals.get(dateKey) || 0) + entry.amount);
      });
      
      const averageDailyIntake = dailyTotals.size > 0 
        ? Array.from(dailyTotals.values()).reduce((sum, total) => sum + total, 0) / dailyTotals.size
        : 0;

      // Calculate streak
      let streakDays = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        const dayTotal = dailyTotals.get(dateKey) || 0;
        
        if (dayTotal >= dailyGoal * 0.8) { // 80% of goal counts as a streak day
          streakDays++;
        } else {
          break;
        }
      }

      return {
        dailyGoal,
        currentIntake,
        remainingIntake: Math.max(0, dailyGoal - currentIntake),
        percentageComplete: dailyGoal > 0 ? (currentIntake / dailyGoal) * 100 : 0,
        streakDays,
        averageDailyIntake
      };
    } catch (error) {
      console.error('Error getting water stats:', error);
      throw error;
    }
  }

  // Daily Progress
  static async getDailyProgress(userId: string, date: string): Promise<DailyProgress | null> {
    try {
      const progressRef = collection(db, 'dailyProgress');
      const q = query(
        progressRef,
        where('userId', '==', userId),
        where('date', '==', date),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        userId: data.userId,
        date: data.date,
        completedTasks: data.completedTasks || [],
        weightLogged: data.weightLogged || false,
        waterIntake: data.waterIntake || 0,
        waterGoal: data.waterGoal || 2000,
        streakCount: data.streakCount || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error getting daily progress:', error);
      throw error;
    }
  }

  static async createDailyProgress(progress: Omit<DailyProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const progressRef = collection(db, 'dailyProgress');
      const docRef = await addDoc(progressRef, {
        ...progress,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating daily progress:', error);
      throw error;
    }
  }

  static async updateDailyProgress(progressId: string, updates: Partial<DailyProgress>): Promise<void> {
    try {
      const progressRef = doc(db, 'dailyProgress', progressId);
      await updateDoc(progressRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating daily progress:', error);
      throw error;
    }
  }

  static async markTaskCompleted(userId: string, date: string, taskId: string): Promise<void> {
    try {
      let progress = await this.getDailyProgress(userId, date);
      
      if (!progress) {
        // Create new progress entry
        const progressId = await this.createDailyProgress({
          userId,
          date,
          completedTasks: [taskId],
          weightLogged: false,
          waterIntake: 0,
          waterGoal: 2000,
          streakCount: 0
        });
        progress = await this.getDailyProgress(userId, date);
      } else {
        // Update existing progress
        const updatedTasks = progress.completedTasks.includes(taskId) 
          ? progress.completedTasks 
          : [...progress.completedTasks, taskId];
        
        await this.updateDailyProgress(progress.id, {
          completedTasks: updatedTasks
        });
      }
    } catch (error) {
      console.error('Error marking task completed:', error);
      throw error;
    }
  }
} 
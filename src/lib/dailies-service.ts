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
  writeBatch,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  DailyEntry, 
  DailyStats, 
  DailyTrends, 
  CreateDailyEntryRequest, 
  UpdateDailyEntryRequest 
} from '../types';

const COLLECTION_NAME = 'daily_entries';

export class DailiesService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private getCollectionRef() {
    return collection(db, COLLECTION_NAME);
  }

  private getDocRef(id: string) {
    return doc(db, COLLECTION_NAME, id);
  }

  /**
   * Get today's daily entry
   */
  async getTodayEntry(): Promise<DailyEntry | null> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const q = query(
        this.getCollectionRef(),
        where('userId', '==', this.userId),
        where('date', '==', today),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.mapFirestoreDoc(doc);
    } catch (error) {
      console.error('Error getting today\'s entry:', error);
      throw error;
    }
  }

  /**
   * Get daily entry for a specific date
   */
  async getEntryByDate(date: string): Promise<DailyEntry | null> {
    try {
      const q = query(
        this.getCollectionRef(),
        where('userId', '==', this.userId),
        where('date', '==', date),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.mapFirestoreDoc(doc);
    } catch (error) {
      console.error('Error getting entry by date:', error);
      throw error;
    }
  }

  /**
   * Create or update today's daily entry
   */
  async createOrUpdateTodayEntry(data: CreateDailyEntryRequest): Promise<DailyEntry> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Check if entry already exists for today
      const existingEntry = await this.getTodayEntry();
      
      if (existingEntry) {
        // Update existing entry
        return await this.updateEntry(existingEntry.id, data);
      } else {
        // Create new entry
        return await this.createEntry(data);
      }
    } catch (error) {
      console.error('Error creating/updating today\'s entry:', error);
      throw error;
    }
  }

  /**
   * Create a new daily entry
   */
  async createEntry(data: CreateDailyEntryRequest): Promise<DailyEntry> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const entryData = {
        userId: this.userId,
        date: today,
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(this.getCollectionRef(), entryData);
      
      return {
        id: docRef.id,
        ...entryData,
        createdAt: entryData.createdAt.toDate(),
        updatedAt: entryData.updatedAt.toDate()
      };
    } catch (error) {
      console.error('Error creating daily entry:', error);
      throw error;
    }
  }

  /**
   * Update an existing daily entry
   */
  async updateEntry(id: string, data: UpdateDailyEntryRequest): Promise<DailyEntry> {
    try {
      const docRef = this.getDocRef(id);
      
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
      
      // Get the updated document
      const updatedDoc = await getDoc(docRef);
      return this.mapFirestoreDoc(updatedDoc);
    } catch (error) {
      console.error('Error updating daily entry:', error);
      throw error;
    }
  }

  /**
   * Delete a daily entry
   */
  async deleteEntry(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting daily entry:', error);
      throw error;
    }
  }

  /**
   * Get recent daily entries
   */
  async getRecentEntries(limitCount: number = 30): Promise<DailyEntry[]> {
    try {
      const q = query(
        this.getCollectionRef(),
        where('userId', '==', this.userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFirestoreDoc(doc));
    } catch (error) {
      console.error('Error getting recent entries:', error);
      throw error;
    }
  }

  /**
   * Get daily entries for a date range
   */
  async getEntriesByDateRange(startDate: string, endDate: string): Promise<DailyEntry[]> {
    try {
      const q = query(
        this.getCollectionRef(),
        where('userId', '==', this.userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFirestoreDoc(doc));
    } catch (error) {
      console.error('Error getting entries by date range:', error);
      throw error;
    }
  }

  /**
   * Get daily statistics
   */
  async getDailyStats(date: string): Promise<DailyStats> {
    try {
      const entry = await this.getEntryByDate(date);
      const hasEntry = !!entry;
      
      // Calculate completion rate if entry exists
      let completionRate = 0;
      if (entry) {
        const totalMetrics = 9; // Total number of metrics
        const completedMetrics = [
          entry.sleepQuality > 0,
          entry.workoutCompleted !== undefined,
          entry.steps > 0,
          entry.stressLevel > 0,
          entry.fatigueLevel > 0,
          entry.hungerLevel > 0,
          entry.goalReviewCompleted !== undefined,
          entry.tomorrowPlanningCompleted !== undefined,
          entry.weight !== undefined
        ].filter(Boolean).length;
        
        completionRate = (completedMetrics / totalMetrics) * 100;
      }

      return {
        id: `stats-${date}`,
        userId: this.userId,
        date,
        hasEntry,
        completionRate
      };
    } catch (error) {
      console.error('Error getting daily stats:', error);
      throw error;
    }
  }



  /**
   * Get daily trends for a date range
   */
  async getDailyTrends(startDate: string, endDate: string): Promise<DailyTrends> {
    try {
      const entries = await this.getEntriesByDateRange(startDate, endDate);
      
      if (entries.length === 0) {
        return this.getEmptyTrends(startDate, endDate);
      }

      // Calculate averages and trends
      const sleepQualityAvg = this.calculateAverage(entries.map(e => e.sleepQuality));
      const stepsAvg = this.calculateAverage(entries.map(e => e.steps));
      const stressLevelAvg = this.calculateAverage(entries.map(e => e.stressLevel));
      const fatigueLevelAvg = this.calculateAverage(entries.map(e => e.fatigueLevel));
      const hungerLevelAvg = this.calculateAverage(entries.map(e => e.hungerLevel));

      // Calculate workout frequency
      const workoutEntries = entries.filter(e => e.workoutCompleted);
      const workoutPercentage = (workoutEntries.length / entries.length) * 100;

      // Calculate goal review frequency
      const goalReviewEntries = entries.filter(e => e.goalReviewCompleted);
      const goalReviewPercentage = (goalReviewEntries.length / entries.length) * 100;

      // Calculate planning frequency
      const planningEntries = entries.filter(e => e.tomorrowPlanningCompleted);
      const planningPercentage = (planningEntries.length / entries.length) * 100;

      // Calculate trends (simplified - could be enhanced with more sophisticated analysis)
      const sleepQualityTrend = this.calculateTrend(entries.map(e => e.sleepQuality));
      const stressLevelTrend = this.calculateTrend(entries.map(e => e.stressLevel));
      const fatigueLevelTrend = this.calculateTrend(entries.map(e => e.fatigueLevel));
      const hungerLevelTrend = this.calculateTrend(entries.map(e => e.hungerLevel));

      return {
        userId: this.userId,
        dateRange: { start: startDate, end: endDate },
        sleepQuality: {
          average: sleepQualityAvg,
          trend: sleepQualityTrend
        },
        workoutFrequency: {
          percentage: workoutPercentage,
          streak: await this.calculateWorkoutStreak(endDate)
        },
        steps: {
          average: stepsAvg,
          total: entries.reduce((sum, e) => sum + e.steps, 0),
          goalMet: stepsAvg >= 10000 // Assuming 10k steps goal
        },
        stressLevel: {
          average: stressLevelAvg,
          trend: stressLevelTrend
        },
        fatigueLevel: {
          average: fatigueLevelAvg,
          trend: fatigueLevelTrend
        },
        hungerLevel: {
          average: hungerLevelAvg,
          trend: hungerLevelTrend
        },
        goalReviewFrequency: {
          percentage: goalReviewPercentage,
          streak: await this.calculateGoalReviewStreak(endDate)
        },
        planningFrequency: {
          percentage: planningPercentage,
          streak: await this.calculatePlanningStreak(endDate)
        }
      };
    } catch (error) {
      console.error('Error getting daily trends:', error);
      throw error;
    }
  }

  /**
   * Calculate workout streak
   */
  private async calculateWorkoutStreak(currentDate: string): Promise<number> {
    try {
      let streak = 0;
      let currentDateObj = new Date(currentDate);
      
      while (true) {
        const dateStr = currentDateObj.toISOString().split('T')[0];
        const entry = await this.getEntryByDate(dateStr);
        
        if (entry && entry.workoutCompleted) {
          streak++;
          currentDateObj.setDate(currentDateObj.getDate() - 1);
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating workout streak:', error);
      return 0;
    }
  }

  /**
   * Calculate goal review streak
   */
  private async calculateGoalReviewStreak(currentDate: string): Promise<number> {
    try {
      let streak = 0;
      let currentDateObj = new Date(currentDate);
      
      while (true) {
        const dateStr = currentDateObj.toISOString().split('T')[0];
        const entry = await this.getEntryByDate(dateStr);
        
        if (entry && entry.goalReviewCompleted) {
          streak++;
          currentDateObj.setDate(currentDateObj.getDate() - 1);
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating goal review streak:', error);
      return 0;
    }
  }

  /**
   * Calculate planning streak
   */
  private async calculatePlanningStreak(currentDate: string): Promise<number> {
    try {
      let streak = 0;
      let currentDateObj = new Date(currentDate);
      
      while (true) {
        const dateStr = currentDateObj.toISOString().split('T')[0];
        const entry = await this.getEntryByDate(dateStr);
        
        if (entry && entry.tomorrowPlanningCompleted) {
          streak++;
          currentDateObj.setDate(currentDateObj.getDate() - 1);
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating planning streak:', error);
      return 0;
    }
  }

  /**
   * Helper method to calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Helper method to calculate trend
   */
  private calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
    if (values.length < 2) return 'stable';
    
    // Simple trend calculation - could be enhanced
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);
    
    const difference = secondAvg - firstAvg;
    
    if (Math.abs(difference) < 0.5) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  }

  /**
   * Get empty trends object
   */
  private getEmptyTrends(startDate: string, endDate: string): DailyTrends {
    return {
      userId: this.userId,
      dateRange: { start: startDate, end: endDate },
      sleepQuality: { average: 0, trend: 'stable' },
      workoutFrequency: { percentage: 0, streak: 0 },
      steps: { average: 0, total: 0, goalMet: false },
      stressLevel: { average: 0, trend: 'stable' },
      fatigueLevel: { average: 0, trend: 'stable' },
      hungerLevel: { average: 0, trend: 'stable' },
      goalReviewFrequency: { percentage: 0, streak: 0 },
      planningFrequency: { percentage: 0, streak: 0 }
    };
  }

  /**
   * Map Firestore document to DailyEntry
   */
  private mapFirestoreDoc(doc: any): DailyEntry {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      date: data.date,
      sleepQuality: data.sleepQuality || 0,
      weight: data.weight,
      workoutCompleted: data.workoutCompleted || false,
      steps: data.steps || 0,
      stressLevel: data.stressLevel || 0,
      fatigueLevel: data.fatigueLevel || 0,
      hungerLevel: data.hungerLevel || 0,
      goalReviewCompleted: data.goalReviewCompleted || false,
      tomorrowPlanningCompleted: data.tomorrowPlanningCompleted || false,
      notes: data.notes,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }
} 
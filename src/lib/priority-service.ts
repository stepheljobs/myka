import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Priority } from '../types';

export class PriorityService {
  private static instance: PriorityService;

  private constructor() {}

  static getInstance(): PriorityService {
    if (!PriorityService.instance) {
      PriorityService.instance = new PriorityService();
    }
    return PriorityService.instance;
  }

  // Get all priorities for a user on a specific date
  async getPrioritiesByDate(userId: string, date: string): Promise<Priority[]> {
    try {
      const q = query(
        collection(db, 'priorities'),
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('priority', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Priority[];
    } catch (error) {
      console.error('Error getting priorities by date:', error);
      throw error;
    }
  }

  // Get priorities for a date range
  async getPrioritiesByDateRange(userId: string, startDate: string, endDate: string): Promise<Priority[]> {
    try {
      const q = query(
        collection(db, 'priorities'),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc'),
        orderBy('priority', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Priority[];
    } catch (error) {
      console.error('Error getting priorities by date range:', error);
      throw error;
    }
  }

  // Get a specific priority
  async getPriority(priorityId: string): Promise<Priority | null> {
    try {
      const docRef = doc(db, 'priorities', priorityId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Priority;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting priority:', error);
      throw error;
    }
  }

  // Create a new priority
  async createPriority(priority: Omit<Priority, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Check if priority number is already taken for this date
      const existingPriorities = await this.getPrioritiesByDate(priority.userId, priority.date);
      const priorityExists = existingPriorities.some(p => p.priority === priority.priority);
      
      if (priorityExists) {
        throw new Error(`Priority ${priority.priority} already exists for this date`);
      }

      const docRef = await addDoc(collection(db, 'priorities'), {
        ...priority,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating priority:', error);
      throw error;
    }
  }

  // Update a priority
  async updatePriority(priorityId: string, updates: Partial<Priority>): Promise<void> {
    try {
      const docRef = doc(db, 'priorities', priorityId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating priority:', error);
      throw error;
    }
  }

  // Delete a priority
  async deletePriority(priorityId: string): Promise<void> {
    try {
      const docRef = doc(db, 'priorities', priorityId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting priority:', error);
      throw error;
    }
  }

  // Toggle priority completion
  async togglePriorityCompletion(priorityId: string): Promise<void> {
    try {
      const priority = await this.getPriority(priorityId);
      if (priority) {
        await this.updatePriority(priorityId, { completed: !priority.completed });
      }
    } catch (error) {
      console.error('Error toggling priority completion:', error);
      throw error;
    }
  }

  // Get today's priorities
  async getTodayPriorities(userId: string): Promise<Priority[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getPrioritiesByDate(userId, today);
  }

  // Get recent priorities
  async getRecentPriorities(userId: string, limitCount: number = 20): Promise<Priority[]> {
    try {
      const q = query(
        collection(db, 'priorities'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Priority[];
    } catch (error) {
      console.error('Error getting recent priorities:', error);
      throw error;
    }
  }

  // Get completed priorities for a date range
  async getCompletedPriorities(userId: string, startDate: string, endDate: string): Promise<Priority[]> {
    try {
      const q = query(
        collection(db, 'priorities'),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        where('completed', '==', true),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Priority[];
    } catch (error) {
      console.error('Error getting completed priorities:', error);
      throw error;
    }
  }

  // Get priority statistics for a date range
  async getPriorityStats(userId: string, startDate: string, endDate: string): Promise<{
    totalPriorities: number;
    completedPriorities: number;
    completionRate: number;
    averageCompletionRate: number;
    priorityBreakdown: Record<Priority['priority'], number>;
    completionByPriority: Record<Priority['priority'], { total: number; completed: number }>;
    streakDays: number;
    longestStreak: number;
  }> {
    try {
      const priorities = await this.getPrioritiesByDateRange(userId, startDate, endDate);
      
      const totalPriorities = priorities.length;
      const completedPriorities = priorities.filter(p => p.completed).length;
      const completionRate = totalPriorities > 0 ? (completedPriorities / totalPriorities) * 100 : 0;
      
      const priorityBreakdown = priorities.reduce((acc, priority) => {
        acc[priority.priority] = (acc[priority.priority] || 0) + 1;
        return acc;
      }, {} as Record<Priority['priority'], number>);
      
      const completionByPriority = priorities.reduce((acc, priority) => {
        if (!acc[priority.priority]) {
          acc[priority.priority] = { total: 0, completed: 0 };
        }
        acc[priority.priority].total += 1;
        if (priority.completed) {
          acc[priority.priority].completed += 1;
        }
        return acc;
      }, {} as Record<Priority['priority'], { total: number; completed: number }>);
      
      // Calculate completion rate by day
      const dailyCompletionRates: number[] = [];
      const dateSet = new Set(priorities.map(p => p.date));
      const uniqueDates = Array.from(dateSet);
      
      for (const date of uniqueDates) {
        const dayPriorities = priorities.filter(p => p.date === date);
        const dayCompleted = dayPriorities.filter(p => p.completed).length;
        const dayRate = dayPriorities.length > 0 ? (dayCompleted / dayPriorities.length) * 100 : 0;
        dailyCompletionRates.push(dayRate);
      }
      
      const averageCompletionRate = dailyCompletionRates.length > 0 
        ? dailyCompletionRates.reduce((sum, rate) => sum + rate, 0) / dailyCompletionRates.length 
        : 0;
      
      // Calculate streak
      const sortedDates = uniqueDates.sort();
      let currentStreak = 0;
      let longestStreak = 0;
      
      for (const date of sortedDates) {
        const dayPriorities = priorities.filter(p => p.date === date);
        const dayCompleted = dayPriorities.filter(p => p.completed).length;
        const dayRate = dayPriorities.length > 0 ? (dayCompleted / dayPriorities.length) * 100 : 0;
        
        if (dayRate >= 80) { // 80% completion threshold
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      return {
        totalPriorities,
        completedPriorities,
        completionRate,
        averageCompletionRate,
        priorityBreakdown,
        completionByPriority,
        streakDays: currentStreak,
        longestStreak
      };
    } catch (error) {
      console.error('Error getting priority stats:', error);
      throw error;
    }
  }

  // Copy priorities from one date to another
  async copyPriorities(userId: string, fromDate: string, toDate: string): Promise<void> {
    try {
      const sourcePriorities = await this.getPrioritiesByDate(userId, fromDate);
      
      for (const priority of sourcePriorities) {
        await this.createPriority({
          ...priority,
          date: toDate,
          completed: false // Reset completion status
        });
      }
    } catch (error) {
      console.error('Error copying priorities:', error);
      throw error;
    }
  }

  // Get priority suggestions based on recent patterns
  async getPrioritySuggestions(userId: string): Promise<string[]> {
    try {
      const recentPriorities = await this.getRecentPriorities(userId, 50);
      
      // Count frequency of priority titles
      const titleCounts: Record<string, number> = {};
      recentPriorities.forEach(priority => {
        titleCounts[priority.title] = (titleCounts[priority.title] || 0) + 1;
      });
      
      // Return most frequent titles as suggestions
      return Object.entries(titleCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([title]) => title);
    } catch (error) {
      console.error('Error getting priority suggestions:', error);
      return [];
    }
  }

  // Bulk create priorities for a date
  async createBulkPriorities(userId: string, date: string, priorities: Array<{ title: string; description?: string }>): Promise<string[]> {
    try {
      const priorityIds: string[] = [];
      
      for (let i = 0; i < Math.min(priorities.length, 3); i++) {
        const priority = priorities[i];
        const priorityId = await this.createPriority({
          userId,
          title: priority.title,
          description: priority.description,
          priority: (i + 1) as 1 | 2 | 3,
          completed: false,
          date
        });
        priorityIds.push(priorityId);
      }
      
      return priorityIds;
    } catch (error) {
      console.error('Error creating bulk priorities:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const priorityService = PriorityService.getInstance(); 
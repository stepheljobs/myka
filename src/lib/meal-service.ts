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
import { MealLog, FoodItem } from '../types';

export class MealService {
  private static instance: MealService;

  private constructor() {}

  static getInstance(): MealService {
    if (!MealService.instance) {
      MealService.instance = new MealService();
    }
    return MealService.instance;
  }

  // Get all meal logs for a user on a specific date
  async getMealLogsByDate(userId: string, date: string): Promise<MealLog[]> {
    try {
      const q = query(
        collection(db, 'mealLogs'),
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as MealLog[];
    } catch (error) {
      console.error('Error getting meal logs by date:', error);
      throw error;
    }
  }

  // Get meal logs for a date range
  async getMealLogsByDateRange(userId: string, startDate: string, endDate: string): Promise<MealLog[]> {
    try {
      const q = query(
        collection(db, 'mealLogs'),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as MealLog[];
    } catch (error) {
      console.error('Error getting meal logs by date range:', error);
      throw error;
    }
  }

  // Get a specific meal log
  async getMealLog(mealLogId: string): Promise<MealLog | null> {
    try {
      const docRef = doc(db, 'mealLogs', mealLogId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as MealLog;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting meal log:', error);
      throw error;
    }
  }

  // Create a new meal log
  async createMealLog(mealLog: Omit<MealLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Calculate total calories if not provided
      if (!mealLog.totalCalories) {
        mealLog.totalCalories = this.calculateTotalCalories(mealLog.foods);
      }

      const docRef = await addDoc(collection(db, 'mealLogs'), {
        ...mealLog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating meal log:', error);
      throw error;
    }
  }

  // Update a meal log
  async updateMealLog(mealLogId: string, updates: Partial<MealLog>): Promise<void> {
    try {
      // Recalculate total calories if foods were updated
      if (updates.foods) {
        updates.totalCalories = this.calculateTotalCalories(updates.foods);
      }

      const docRef = doc(db, 'mealLogs', mealLogId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating meal log:', error);
      throw error;
    }
  }

  // Delete a meal log
  async deleteMealLog(mealLogId: string): Promise<void> {
    try {
      const docRef = doc(db, 'mealLogs', mealLogId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting meal log:', error);
      throw error;
    }
  }

  // Get meal logs by type for a specific date
  async getMealLogsByType(userId: string, date: string, mealType: MealLog['mealType']): Promise<MealLog[]> {
    try {
      const q = query(
        collection(db, 'mealLogs'),
        where('userId', '==', userId),
        where('date', '==', date),
        where('mealType', '==', mealType),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as MealLog[];
    } catch (error) {
      console.error('Error getting meal logs by type:', error);
      throw error;
    }
  }

  // Get recent meal logs
  async getRecentMealLogs(userId: string, limitCount: number = 10): Promise<MealLog[]> {
    try {
      const q = query(
        collection(db, 'mealLogs'),
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
      })) as MealLog[];
    } catch (error) {
      console.error('Error getting recent meal logs:', error);
      throw error;
    }
  }

  // Get meal statistics for a date range
  async getMealStats(userId: string, startDate: string, endDate: string): Promise<{
    totalMeals: number;
    totalCalories: number;
    averageCaloriesPerMeal: number;
    mealTypeBreakdown: Record<MealLog['mealType'], number>;
    caloriesByMealType: Record<MealLog['mealType'], number>;
    mostLoggedFoods: Array<{ name: string; count: number }>;
  }> {
    try {
      const mealLogs = await this.getMealLogsByDateRange(userId, startDate, endDate);
      
      const totalMeals = mealLogs.length;
      const totalCalories = mealLogs.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
      const averageCaloriesPerMeal = totalMeals > 0 ? totalCalories / totalMeals : 0;
      
      const mealTypeBreakdown = mealLogs.reduce((acc, meal) => {
        acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
        return acc;
      }, {} as Record<MealLog['mealType'], number>);
      
      const caloriesByMealType = mealLogs.reduce((acc, meal) => {
        acc[meal.mealType] = (acc[meal.mealType] || 0) + (meal.totalCalories || 0);
        return acc;
      }, {} as Record<MealLog['mealType'], number>);
      
      // Count most logged foods
      const foodCounts: Record<string, number> = {};
      mealLogs.forEach(meal => {
        meal.foods.forEach(food => {
          foodCounts[food.name] = (foodCounts[food.name] || 0) + 1;
        });
      });
      
      const mostLoggedFoods = Object.entries(foodCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      return {
        totalMeals,
        totalCalories,
        averageCaloriesPerMeal,
        mealTypeBreakdown,
        caloriesByMealType,
        mostLoggedFoods
      };
    } catch (error) {
      console.error('Error getting meal stats:', error);
      throw error;
    }
  }

  // Calculate total calories from food items
  private calculateTotalCalories(foods: FoodItem[]): number {
    return foods.reduce((total, food) => {
      return total + (food.calories || 0);
    }, 0);
  }

  // Search for common foods (mock data for now)
  async searchFoods(query: string): Promise<FoodItem[]> {
    // This would typically connect to a food database API
    // For now, return mock data
    const mockFoods: FoodItem[] = [
      { name: 'Chicken Breast', quantity: 100, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: 'Brown Rice', quantity: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
      { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
      { name: 'Salmon', quantity: 100, unit: 'g', calories: 208, protein: 25, carbs: 0, fat: 12 },
      { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
      { name: 'Greek Yogurt', quantity: 100, unit: 'g', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
      { name: 'Banana', quantity: 100, unit: 'g', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
      { name: 'Almonds', quantity: 100, unit: 'g', calories: 579, protein: 21, carbs: 22, fat: 50 },
      { name: 'Spinach', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
      { name: 'Eggs', quantity: 100, unit: 'g', calories: 155, protein: 13, carbs: 1.1, fat: 11 }
    ];

    return mockFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Get daily nutrition summary
  async getDailyNutritionSummary(userId: string, date: string): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealCount: number;
    calorieGoal?: number;
    proteinGoal?: number;
    carbsGoal?: number;
    fatGoal?: number;
  }> {
    try {
      const mealLogs = await this.getMealLogsByDate(userId, date);
      
      const totalCalories = mealLogs.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
      const totalProtein = mealLogs.reduce((sum, meal) => 
        sum + meal.foods.reduce((foodSum, food) => foodSum + (food.protein || 0), 0), 0
      );
      const totalCarbs = mealLogs.reduce((sum, meal) => 
        sum + meal.foods.reduce((foodSum, food) => foodSum + (food.carbs || 0), 0), 0
      );
      const totalFat = mealLogs.reduce((sum, meal) => 
        sum + meal.foods.reduce((foodSum, food) => foodSum + (food.fat || 0), 0), 0
      );
      
      return {
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        mealCount: mealLogs.length,
        // TODO: Get user's nutrition goals from user preferences
        calorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 250,
        fatGoal: 65
      };
    } catch (error) {
      console.error('Error getting daily nutrition summary:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const mealService = MealService.getInstance(); 
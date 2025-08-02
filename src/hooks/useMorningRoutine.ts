import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  MorningRoutineConfig, 
  WeightEntry, 
  WaterEntry, 
  DailyProgress,
  WeightStats,
  WaterStats,
  DailyWeightSummary,
  WeightTrendData
} from '@/types';

// Morning Routine Configuration
export const useRoutineConfig = () => {
  return useQuery({
    queryKey: ['morningRoutine', 'config'],
    queryFn: async () => {
      const response = await fetch('/api/morning-routine/config');
      if (!response.ok) throw new Error('Failed to fetch routine config');
      const data = await response.json();
      return data.config as MorningRoutineConfig | null;
    },
  });
};

export const useUpdateRoutineConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (config: Partial<MorningRoutineConfig>) => {
      const response = await fetch('/api/morning-routine/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to update routine config');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['morningRoutine', 'config'] });
    },
  });
};

// Daily Progress
export const useDailyProgress = (date: string) => {
  return useQuery({
    queryKey: ['morningRoutine', 'progress', date],
    queryFn: async () => {
      const response = await fetch(`/api/morning-routine/progress/${date}`);
      if (!response.ok) throw new Error('Failed to fetch daily progress');
      const data = await response.json();
      return data.progress as DailyProgress | null;
    },
  });
};

export const useMarkTaskCompleted = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, date }: { taskId: string; date: string }) => {
      const response = await fetch('/api/morning-routine/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, date }),
      });
      if (!response.ok) throw new Error('Failed to mark task completed');
      return response.json();
    },
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: ['morningRoutine', 'progress', date] });
    },
  });
};

// Weight Tracking
export const useWeightHistory = (limit: number = 30) => {
  return useQuery({
    queryKey: ['weight', 'history', limit],
    queryFn: async () => {
      const response = await fetch(`/api/weight/history?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch weight history');
      const data = await response.json();
      return data.history as WeightEntry[];
    },
  });
};

export const useWeightStats = () => {
  return useQuery({
    queryKey: ['weight', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/weight/stats');
      if (!response.ok) throw new Error('Failed to fetch weight stats');
      const data = await response.json();
      return data.stats as WeightStats;
    },
  });
};

export const useLogWeight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Omit<WeightEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/weight/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error('Failed to log weight');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight'] });
    },
  });
};

// Enhanced Weight Tracking Hooks
export const useDailyWeightSummary = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['weight', 'daily-summary', startDate, endDate],
    queryFn: async () => {
      const response = await fetch(`/api/weight/daily-summary?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch daily weight summary');
      const data = await response.json();
      return data.data as { period: string; summary: DailyWeightSummary[] };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useWeightTrend = (period: '7d' | '14d' | '30d' | '90d', startDate?: string) => {
  return useQuery({
    queryKey: ['weight', 'trend', period, startDate],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (startDate) params.append('startDate', startDate);
      
      const response = await fetch(`/api/weight/trend?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch weight trend');
      const data = await response.json();
      return data.data as WeightTrendData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useTodayWeight = () => {
  return useQuery({
    queryKey: ['weight', 'today'],
    queryFn: async () => {
      const response = await fetch('/api/weight/today');
      if (!response.ok) throw new Error('Failed to fetch today\'s weight');
      const data = await response.json();
      return data.data as WeightEntry | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWeightForDate = (date: string) => {
  return useQuery({
    queryKey: ['weight', 'date', date],
    queryFn: async () => {
      const response = await fetch(`/api/weight/date/${date}`);
      if (!response.ok) throw new Error('Failed to fetch weight for date');
      const data = await response.json();
      return data.data as WeightEntry | null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEnhancedWeightStats = () => {
  return useQuery({
    queryKey: ['weight', 'stats', 'enhanced'],
    queryFn: async () => {
      const response = await fetch('/api/weight/stats/enhanced');
      if (!response.ok) throw new Error('Failed to fetch enhanced weight stats');
      const data = await response.json();
      return data.data as WeightStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Water Tracking
export const useTodayWaterIntake = () => {
  return useQuery({
    queryKey: ['water', 'today'],
    queryFn: async () => {
      const response = await fetch('/api/water/today');
      if (!response.ok) throw new Error('Failed to fetch today water intake');
      const data = await response.json();
      return {
        todayEntries: data.todayEntries as WaterEntry[],
        stats: data.stats as WaterStats,
      };
    },
  });
};

export const useLogWater = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Omit<WaterEntry, 'id' | 'userId' | 'createdAt'>) => {
      const response = await fetch('/api/water/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error('Failed to log water');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water'] });
    },
  });
};

// Utility functions
export const getTodayDateString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getDefaultRoutineConfig = (userId: string): Omit<MorningRoutineConfig, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    userId,
    wakeUpTime: '06:00',
    enabled: true,
    tasks: [
      {
        id: 'weight-tracking',
        type: 'weight',
        title: 'Log Weight',
        description: 'Track your daily weight',
        icon: '⚖️',
        enabled: true,
        order: 1,
      },
      {
        id: 'water-intake',
        type: 'water',
        title: 'Drink Water',
        description: 'Stay hydrated',
        icon: '💧',
        enabled: true,
        order: 2,
      },
    ],
    notificationSettings: {
      enabled: true,
      sound: true,
      vibration: true,
      snoozeEnabled: true,
      snoozeDuration: 10,
    },
  };
}; 
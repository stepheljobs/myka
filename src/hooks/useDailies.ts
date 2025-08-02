import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { DailiesService } from '../lib/dailies-service';
import { 
  DailyEntry, 
  DailyStats, 
  DailyTrends, 
  CreateDailyEntryRequest, 
  UpdateDailyEntryRequest 
} from '../types';

export const useDailies = () => {
  const { state } = useAuth();
  const queryClient = useQueryClient();
  
  if (!state.user) {
    throw new Error('User must be authenticated to use dailies');
  }

  // Query keys
  const dailiesKeys = {
    all: ['dailies'] as const,
    today: () => [...dailiesKeys.all, 'today'] as const,
    byDate: (date: string) => [...dailiesKeys.all, 'date', date] as const,
    stats: (date: string) => [...dailiesKeys.all, 'stats', date] as const,
    trends: (startDate: string, endDate: string) => [...dailiesKeys.all, 'trends', startDate, endDate] as const,
    recent: (limit: number) => [...dailiesKeys.all, 'recent', limit] as const,
  };

  // Get today's entry
  const useTodayEntry = () => {
    return useQuery({
      queryKey: dailiesKeys.today(),
      queryFn: () => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.getTodayEntry();
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get entry by date
  const useEntryByDate = (date: string) => {
    return useQuery({
      queryKey: dailiesKeys.byDate(date),
      queryFn: () => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.getEntryByDate(date);
      },
      enabled: !!date,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get daily stats
  const useDailyStats = (date: string) => {
    return useQuery({
      queryKey: dailiesKeys.stats(date),
      queryFn: () => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.getDailyStats(date);
      },
      enabled: !!date,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get daily trends
  const useDailyTrends = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: dailiesKeys.trends(startDate, endDate),
      queryFn: () => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.getDailyTrends(startDate, endDate);
      },
      enabled: !!startDate && !!endDate,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  // Get recent entries
  const useRecentEntries = (limit: number = 30) => {
    return useQuery({
      queryKey: dailiesKeys.recent(limit),
      queryFn: () => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.getRecentEntries(limit);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Create or update today's entry
  const useCreateOrUpdateTodayEntry = () => {
    return useMutation({
      mutationFn: (data: CreateDailyEntryRequest) => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.createOrUpdateTodayEntry(data);
      },
      onSuccess: (newEntry) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: dailiesKeys.today() });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.byDate(newEntry.date) });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.stats(newEntry.date) });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.recent(30) });
        
        // Update cache optimistically
        queryClient.setQueryData(dailiesKeys.today(), newEntry);
        queryClient.setQueryData(dailiesKeys.byDate(newEntry.date), newEntry);
      },
      onError: (error) => {
        console.error('Error creating/updating today\'s entry:', error);
      },
    });
  };

  // Create new entry
  const useCreateEntry = () => {
    return useMutation({
      mutationFn: (data: CreateDailyEntryRequest) => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.createEntry(data);
      },
      onSuccess: (newEntry) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: dailiesKeys.today() });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.byDate(newEntry.date) });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.stats(newEntry.date) });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.recent(30) });
        
        // Update cache optimistically
        queryClient.setQueryData(dailiesKeys.today(), newEntry);
        queryClient.setQueryData(dailiesKeys.byDate(newEntry.date), newEntry);
      },
      onError: (error) => {
        console.error('Error creating entry:', error);
      },
    });
  };

  // Update entry
  const useUpdateEntry = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateDailyEntryRequest }) => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.updateEntry(id, data);
      },
      onSuccess: (updatedEntry) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: dailiesKeys.today() });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.byDate(updatedEntry.date) });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.stats(updatedEntry.date) });
        queryClient.invalidateQueries({ queryKey: dailiesKeys.recent(30) });
        
        // Update cache optimistically
        queryClient.setQueryData(dailiesKeys.today(), updatedEntry);
        queryClient.setQueryData(dailiesKeys.byDate(updatedEntry.date), updatedEntry);
      },
      onError: (error) => {
        console.error('Error updating entry:', error);
      },
    });
  };

  // Delete entry
  const useDeleteEntry = () => {
    return useMutation({
      mutationFn: (id: string) => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.deleteEntry(id);
      },
      onSuccess: (_, deletedId) => {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: dailiesKeys.all });
        
        // Remove from cache
        queryClient.removeQueries({ queryKey: dailiesKeys.byDate(deletedId) });
      },
      onError: (error) => {
        console.error('Error deleting entry:', error);
      },
    });
  };

  // Get entries by date range
  const useEntriesByDateRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: [...dailiesKeys.all, 'range', startDate, endDate],
      queryFn: () => {
        const dailiesService = new DailiesService(state.user!.uid);
        return dailiesService.getEntriesByDateRange(startDate, endDate);
      },
      enabled: !!startDate && !!endDate,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  return {
    // Queries
    useTodayEntry,
    useEntryByDate,
    useDailyStats,
    useDailyTrends,
    useRecentEntries,
    useEntriesByDateRange,
    
    // Mutations
    useCreateOrUpdateTodayEntry,
    useCreateEntry,
    useUpdateEntry,
    useDeleteEntry,
  };
}; 
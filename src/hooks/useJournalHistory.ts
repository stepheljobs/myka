import { useState, useEffect, useCallback } from 'react';
import { JournalHistoryEntry, JournalHistoryFilters, JournalHistoryStats } from '../types';
import { JournalHistoryService } from '../lib/journal-history-service';
import { useAuth } from '../contexts/AuthContext';

export function useJournalHistory() {
  const { state } = useAuth();
  const user = state.user;
  
  const [entries, setEntries] = useState<JournalHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<JournalHistoryFilters>({
    limit: 20,
    offset: 0,
  });

  // Load journal history
  const loadHistory = useCallback(async (newFilters?: JournalHistoryFilters) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const journalHistoryService = new JournalHistoryService();
      const updatedFilters = { ...filters, ...newFilters };
      const result = await journalHistoryService.getJournalHistory(user.uid, updatedFilters);
      
      if (newFilters?.offset === 0 || !newFilters) {
        // Reset entries for new search or first load
        setEntries(result.entries);
      } else {
        // Append entries for pagination
        setEntries(prev => [...prev, ...result.entries]);
      }
      
      setHasMore(result.hasMore);
      setFilters(updatedFilters);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  // Load more entries (pagination)
  const loadMore = useCallback(async () => {
    if (!user || !hasMore || loading) return;

    const newFilters = {
      ...filters,
      offset: entries.length,
    };
    
    await loadHistory(newFilters);
  }, [user, hasMore, loading, filters, entries.length, loadHistory]);

  // Search entries
  const searchEntries = useCallback(async (searchQuery: string) => {
    const newFilters = {
      ...filters,
      searchQuery,
      offset: 0, // Reset offset for new search
    };
    
    await loadHistory(newFilters);
  }, [filters, loadHistory]);

  // Filter by date range
  const filterByDateRange = useCallback(async (startDate?: string, endDate?: string) => {
    const newFilters = {
      ...filters,
      startDate,
      endDate,
      offset: 0, // Reset offset for new filter
    };
    
    await loadHistory(newFilters);
  }, [filters, loadHistory]);

  // Get entry by date
  const getEntryByDate = useCallback(async (date: string): Promise<JournalHistoryEntry | null> => {
    if (!user) return null;

    try {
      const journalHistoryService = new JournalHistoryService();
      return await journalHistoryService.getEntryByDate(user.uid, date);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [user]);

  // Update entry
  const updateEntry = useCallback(async (date: string, data: { wins: string; commitments: string }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const journalHistoryService = new JournalHistoryService();
      await journalHistoryService.updateEntry(user.uid, date, data);
      
      // Refresh the current list to show updated entry
      await loadHistory();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [user, loadHistory]);

  // Delete entry
  const deleteEntry = useCallback(async (date: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const journalHistoryService = new JournalHistoryService();
      await journalHistoryService.deleteEntry(user.uid, date);
      
      // Remove the entry from local state
      setEntries(prev => prev.filter(entry => entry.date !== date));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Get statistics
  const getStats = useCallback(async (): Promise<JournalHistoryStats | null> => {
    if (!user) return null;

    try {
      const journalHistoryService = new JournalHistoryService();
      return await journalHistoryService.getJournalStats(user.uid);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [user]);

  // Get calendar data
  const getCalendarData = useCallback(async (year: number, month: number) => {
    if (!user) return {};

    try {
      const journalHistoryService = new JournalHistoryService();
      return await journalHistoryService.getCalendarData(user.uid, year, month);
    } catch (err: any) {
      setError(err.message);
      return {};
    }
  }, [user]);

  // Clear filters and reset
  const clearFilters = useCallback(async () => {
    const resetFilters = {
      limit: 20,
      offset: 0,
    };
    
    await loadHistory(resetFilters);
  }, [loadHistory]);

  // Initial load
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  return {
    entries,
    loading,
    error,
    hasMore,
    filters,
    loadHistory,
    loadMore,
    searchEntries,
    filterByDateRange,
    getEntryByDate,
    updateEntry,
    deleteEntry,
    getStats,
    getCalendarData,
    clearFilters,
  };
} 
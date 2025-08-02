import { useState, useEffect, useCallback } from 'react';
import { JournalEntry, CreateJournalEntryRequest } from '../types';
import { JournalService } from '../lib/journal-service';
import { useAuth } from '../contexts/AuthContext';

export function useJournal() {
  const { state } = useAuth();
  const user = state.user;
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load today's entry
  const loadTodayEntry = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const journalService = new JournalService();
      const entry = await journalService.getTodayEntry(user.uid);
      setTodayEntry(entry);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create or update today's entry
  const saveEntry = useCallback(async (data: CreateJournalEntryRequest) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setError(null);
      const journalService = new JournalService();
      const entryId = await journalService.createOrUpdateTodayEntry(user.uid, data);
      
      // Reload the entry
      await loadTodayEntry();
      
      return entryId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [user, loadTodayEntry]);

  // Get entry for specific date
  const getEntryByDate = useCallback(async (date: string): Promise<JournalEntry | null> => {
    if (!user) return null;

    try {
      const journalService = new JournalService();
      return await journalService.getEntryByDate(user.uid, date);
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [user]);

  // Get recent entries
  const getRecentEntries = useCallback(async (limit: number = 30): Promise<JournalEntry[]> => {
    if (!user) return [];

    try {
      const journalService = new JournalService();
      return await journalService.getRecentEntries(user.uid, limit);
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const journalService = new JournalService();
    const unsubscribeEntry = journalService.onTodayEntrySnapshot(user.uid, (entry) => {
      setTodayEntry(entry);
    });

    return () => {
      unsubscribeEntry();
    };
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) {
      loadTodayEntry();
    }
  }, [user, loadTodayEntry]);

  return {
    todayEntry,
    loading,
    error,
    saveEntry,
    getEntryByDate,
    getRecentEntries,
    loadTodayEntry,
  };
} 
import { FirestoreService } from './firestore-service';
import { JournalHistoryEntry, JournalHistoryFilters, JournalHistoryStats } from '../types';
import { where, orderBy, limit, startAfter } from 'firebase/firestore';

export class JournalHistoryService {
  private firestoreService: FirestoreService;

  constructor() {
    this.firestoreService = new FirestoreService();
  }

  // Get paginated journal history with filters
  async getJournalHistory(
    userId: string, 
    filters: JournalHistoryFilters = {}
  ): Promise<{ entries: JournalHistoryEntry[]; hasMore: boolean }> {
    try {
      const { startDate, endDate, searchQuery, limit: limitCount = 20, offset = 0 } = filters;
      
      const constraints = [
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount),
      ];

      // Add date range filters if provided
      if (startDate) {
        constraints.push(where('date', '>=', startDate));
      }
      if (endDate) {
        constraints.push(where('date', '<=', endDate));
      }

      const entries = await this.firestoreService.query<JournalHistoryEntry>('journal_entries', constraints);
      
      // Apply search filter in memory if provided
      let filteredEntries = entries;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEntries = entries.filter(entry => 
          entry.wins.toLowerCase().includes(query) || 
          entry.commitments.toLowerCase().includes(query)
        );
      }

      // Add previews for entries
      const entriesWithPreviews = filteredEntries.map(entry => ({
        ...entry,
        winsPreview: entry.wins.length > 50 ? entry.wins.substring(0, 50) + '...' : entry.wins,
        commitmentsPreview: entry.commitments.length > 50 ? entry.commitments.substring(0, 50) + '...' : entry.commitments,
      }));

      return {
        entries: entriesWithPreviews,
        hasMore: entries.length === limitCount,
      };
    } catch (error: any) {
      throw new Error(`Failed to get journal history: ${error.message}`);
    }
  }

  // Get calendar data for a specific month
  async getCalendarData(userId: string, year: number, month: number): Promise<{ [date: string]: boolean }> {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
      
      const entries = await this.firestoreService.query<JournalHistoryEntry>('journal_entries', [
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
      ]);

      // Create a map of dates with entries
      const calendarData: { [date: string]: boolean } = {};
      entries.forEach(entry => {
        calendarData[entry.date] = true;
      });

      return calendarData;
    } catch (error: any) {
      throw new Error(`Failed to get calendar data: ${error.message}`);
    }
  }

  // Get entry for specific date
  async getEntryByDate(userId: string, date: string): Promise<JournalHistoryEntry | null> {
    try {
      const entryId = `${userId}_${date}`;
      const entry = await this.firestoreService.read<JournalHistoryEntry>('journal_entries', entryId);
      return entry;
    } catch (error: any) {
      throw new Error(`Failed to get entry by date: ${error.message}`);
    }
  }

  // Update entry for specific date
  async updateEntry(userId: string, date: string, data: { wins: string; commitments: string }): Promise<void> {
    try {
      const entryId = `${userId}_${date}`;
      await this.firestoreService.update('journal_entries', entryId, {
        wins: data.wins,
        commitments: data.commitments,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update entry: ${error.message}`);
    }
  }

  // Delete entry for specific date
  async deleteEntry(userId: string, date: string): Promise<void> {
    try {
      const entryId = `${userId}_${date}`;
      await this.firestoreService.delete('journal_entries', entryId);
    } catch (error: any) {
      throw new Error(`Failed to delete entry: ${error.message}`);
    }
  }

  // Get journal history statistics
  async getJournalStats(userId: string): Promise<JournalHistoryStats> {
    try {
      // Get all entries for the user
      const allEntries = await this.firestoreService.query<JournalHistoryEntry>('journal_entries', [
        where('userId', '==', userId),
        orderBy('date', 'desc'),
      ]);

      const totalEntries = allEntries.length;
      
      // Calculate current month entries
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const entriesThisMonth = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
      }).length;

      // Calculate current week entries
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const entriesThisWeek = allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfWeek;
      }).length;

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const today = new Date();
      let currentDate = new Date(today);

      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasEntry = allEntries.some(entry => entry.date === dateStr);
        
        if (hasEntry) {
          tempStreak++;
          if (currentDate.getTime() === today.getTime()) {
            currentStreak = tempStreak;
          }
          longestStreak = Math.max(longestStreak, tempStreak);
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      const lastEntryDate = allEntries.length > 0 ? allEntries[0].date : undefined;

      return {
        totalEntries,
        entriesThisMonth,
        entriesThisWeek,
        longestStreak,
        currentStreak,
        lastEntryDate,
      };
    } catch (error: any) {
      throw new Error(`Failed to get journal stats: ${error.message}`);
    }
  }
} 
import { FirestoreService } from './firestore-service';
import { JournalEntry, CreateJournalEntryRequest, UpdateJournalEntryRequest } from '../types';
import { where, orderBy, limit } from 'firebase/firestore';

export class JournalService {
  private firestoreService: FirestoreService;

  constructor() {
    this.firestoreService = new FirestoreService();
  }

  // Create or update today's journal entry
  async createOrUpdateTodayEntry(userId: string, data: CreateJournalEntryRequest): Promise<string> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const entryId = `${userId}_${today}`;

    try {
      // Create new entry or update existing one
      const entryData: Omit<JournalEntry, 'id'> = {
        userId,
        date: today,
        wins: data.wins,
        commitments: data.commitments,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Use upsert to create or update
      await this.firestoreService.upsert('journal_entries', entryId, entryData);
      return entryId;
    } catch (error: any) {
      throw new Error(`Failed to create/update journal entry: ${error.message}`);
    }
  }

  // Get today's entry
  async getTodayEntry(userId: string): Promise<JournalEntry | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.getEntryByDate(userId, today);
  }

  // Get entry for specific date
  async getEntryByDate(userId: string, date: string): Promise<JournalEntry | null> {
    const entryId = `${userId}_${date}`;
    
    try {
      const entry = await this.firestoreService.read<JournalEntry>('journal_entries', entryId);
      return entry;
    } catch (error: any) {
      throw new Error(`Failed to get journal entry: ${error.message}`);
    }
  }

  // Get recent entries (last 30 days)
  async getRecentEntries(userId: string, limitCount: number = 30): Promise<JournalEntry[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      const entries = await this.firestoreService.query<JournalEntry>('journal_entries', [
        where('userId', '==', userId),
        where('date', '>=', startDate),
        orderBy('date', 'desc'),
        limit(limitCount),
      ]);

      return entries;
    } catch (error: any) {
      throw new Error(`Failed to get recent entries: ${error.message}`);
    }
  }

  // Delete journal entry
  async deleteEntry(userId: string, date: string): Promise<void> {
    const entryId = `${userId}_${date}`;
    
    try {
      await this.firestoreService.delete('journal_entries', entryId);
    } catch (error: any) {
      throw new Error(`Failed to delete journal entry: ${error.message}`);
    }
  }
} 
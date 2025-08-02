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
import { 
  ScheduledNotificationDocument, 
  NotificationLog, 
  NotificationType 
} from '../types';

export class ScheduledNotificationsService {
  private static instance: ScheduledNotificationsService;

  private constructor() {}

  static getInstance(): ScheduledNotificationsService {
    if (!ScheduledNotificationsService.instance) {
      ScheduledNotificationsService.instance = new ScheduledNotificationsService();
    }
    return ScheduledNotificationsService.instance;
  }

  // Get all scheduled notifications for a user
  async getScheduledNotifications(userId: string): Promise<ScheduledNotificationDocument[]> {
    try {
      const q = query(
        collection(db, 'scheduledNotifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScheduledNotificationDocument[];
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      throw error;
    }
  }

  // Get a specific scheduled notification
  async getScheduledNotification(notificationId: string): Promise<ScheduledNotificationDocument | null> {
    try {
      const docRef = doc(db, 'scheduledNotifications', notificationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as ScheduledNotificationDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting scheduled notification:', error);
      throw error;
    }
  }

  // Create a new scheduled notification
  async createScheduledNotification(notification: Omit<ScheduledNotificationDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'scheduledNotifications'), {
        ...notification,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating scheduled notification:', error);
      throw error;
    }
  }

  // Update a scheduled notification
  async updateScheduledNotification(notificationId: string, updates: Partial<ScheduledNotificationDocument>): Promise<void> {
    try {
      const docRef = doc(db, 'scheduledNotifications', notificationId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating scheduled notification:', error);
      throw error;
    }
  }

  // Delete a scheduled notification
  async deleteScheduledNotification(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, 'scheduledNotifications', notificationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting scheduled notification:', error);
      throw error;
    }
  }

  // Toggle notification enabled status
  async toggleNotification(notificationId: string, enabled: boolean): Promise<void> {
    try {
      const docRef = doc(db, 'scheduledNotifications', notificationId);
      await updateDoc(docRef, {
        enabled,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error toggling notification:', error);
      throw error;
    }
  }

  // Update notification time
  async updateNotificationTime(notificationId: string, newTime: string): Promise<void> {
    try {
      const docRef = doc(db, 'scheduledNotifications', notificationId);
      await updateDoc(docRef, {
        time: newTime,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating notification time:', error);
      throw error;
    }
  }

  // Get notification logs for a user
  async getNotificationLogs(userId: string, limitCount: number = 50): Promise<NotificationLog[]> {
    try {
      const q = query(
        collection(db, 'notificationLogs'),
        where('userId', '==', userId),
        orderBy('triggeredAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        triggeredAt: doc.data().triggeredAt?.toDate(),
        clickedAt: doc.data().clickedAt?.toDate()
      })) as NotificationLog[];
    } catch (error) {
      console.error('Error getting notification logs:', error);
      throw error;
    }
  }

  // Get notification logs for a specific notification
  async getNotificationLogsByType(userId: string, type: NotificationType, limitCount: number = 20): Promise<NotificationLog[]> {
    try {
      const q = query(
        collection(db, 'notificationLogs'),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('triggeredAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        triggeredAt: doc.data().triggeredAt?.toDate(),
        clickedAt: doc.data().clickedAt?.toDate()
      })) as NotificationLog[];
    } catch (error) {
      console.error('Error getting notification logs by type:', error);
      throw error;
    }
  }

  // Log a notification trigger
  async logNotificationTrigger(log: Omit<NotificationLog, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notificationLogs'), {
        ...log,
        triggeredAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error logging notification trigger:', error);
      throw error;
    }
  }

  // Log a notification click
  async logNotificationClick(logId: string, action?: string): Promise<void> {
    try {
      const docRef = doc(db, 'notificationLogs', logId);
      await updateDoc(docRef, {
        clickedAt: serverTimestamp(),
        actionTaken: action
      });
    } catch (error) {
      console.error('Error logging notification click:', error);
      throw error;
    }
  }

  // Log a notification snooze
  async logNotificationSnooze(logId: string, snoozeDuration: number): Promise<void> {
    try {
      const docRef = doc(db, 'notificationLogs', logId);
      await updateDoc(docRef, {
        snoozed: true,
        snoozeDuration
      });
    } catch (error) {
      console.error('Error logging notification snooze:', error);
      throw error;
    }
  }

  // Get notification statistics for a user
  async getNotificationStats(userId: string, days: number = 30): Promise<{
    totalNotifications: number;
    clickedNotifications: number;
    snoozedNotifications: number;
    skippedNotifications: number;
    clickRate: number;
    typeBreakdown: Record<NotificationType, number>;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        collection(db, 'notificationLogs'),
        where('userId', '==', userId),
        where('triggeredAt', '>=', Timestamp.fromDate(startDate))
      );
      
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => doc.data()) as NotificationLog[];
      
      const totalNotifications = logs.length;
      const clickedNotifications = logs.filter(log => log.clickedAt).length;
      const snoozedNotifications = logs.filter(log => log.snoozed).length;
      const skippedNotifications = logs.filter(log => log.actionTaken === 'skip').length;
      
      const typeBreakdown = logs.reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
      }, {} as Record<NotificationType, number>);
      
      return {
        totalNotifications,
        clickedNotifications,
        snoozedNotifications,
        skippedNotifications,
        clickRate: totalNotifications > 0 ? (clickedNotifications / totalNotifications) * 100 : 0,
        typeBreakdown
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const scheduledNotificationsService = ScheduledNotificationsService.getInstance(); 
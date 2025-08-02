import { 
  ScheduledNotification, 
  ScheduledNotificationDocument, 
  NotificationLog, 
  NotificationType, 
  NotificationAction 
} from '../types';

export class NotificationManager {
  private static instance: NotificationManager;
  private registration: ServiceWorkerRegistration | null = null;
  private db: IDBDatabase | null = null;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw-scheduled-notifications.js');
        console.log('Scheduled Notifications Service Worker registered successfully');
        
        // Initialize IndexedDB
        await this.initDatabase();
        
        // Schedule existing notifications
        await this.scheduleDailyNotifications();
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NotificationDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create notifications store
        if (!db.objectStoreNames.contains('notifications')) {
          const notificationStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notificationStore.createIndex('userId', 'userId', { unique: false });
          notificationStore.createIndex('type', 'type', { unique: false });
        }

        // Create notification logs store
        if (!db.objectStoreNames.contains('notificationLogs')) {
          const logStore = db.createObjectStore('notificationLogs', { keyPath: 'id' });
          logStore.createIndex('userId', 'userId', { unique: false });
          logStore.createIndex('notificationId', 'notificationId', { unique: false });
          logStore.createIndex('triggeredAt', 'triggeredAt', { unique: false });
        }
      };
    });
  }

  async scheduleDailyNotifications(): Promise<void> {
    const defaultNotifications: ScheduledNotification[] = [
      {
        id: 'weight-tracking',
        time: '06:00',
        title: 'Time to Track Your Progress! ⚖️',
        body: 'Start your day by logging your weight before your first glass of water.',
        type: 'weight-tracking',
        actions: [
          { action: 'log-weight', title: 'Log Weight', icon: '⚖️' },
          { action: 'skip', title: 'Skip', icon: '⏭️' },
          { action: 'snooze', title: 'Snooze 10min', icon: '⏰' }
        ],
        enabled: true,
        snoozeEnabled: true,
        snoozeDuration: 10
      },
      {
        id: 'priority-review',
        time: '06:30',
        title: 'Set Your Top 3 Priorities! 🎯',
        body: 'Review and set your most important goals for today.',
        type: 'priority-review',
        actions: [
          { action: 'review-priorities', title: 'Review Priorities', icon: '🎯' },
          { action: 'skip', title: 'Skip', icon: '⏭️' },
          { action: 'snooze', title: 'Snooze 10min', icon: '⏰' }
        ],
        enabled: true,
        snoozeEnabled: true,
        snoozeDuration: 10
      },
      {
        id: 'lunch-logging',
        time: '12:00',
        title: 'Log Your Lunch! 🍽️',
        body: 'Keep track of your nutrition by logging what you ate for lunch.',
        type: 'meal-logging',
        actions: [
          { action: 'log-meal', title: 'Log Meal', icon: '🍽️' },
          { action: 'skip', title: 'Skip', icon: '⏭️' },
          { action: 'snooze', title: 'Snooze 15min', icon: '⏰' }
        ],
        enabled: true,
        snoozeEnabled: true,
        snoozeDuration: 15
      },
      {
        id: 'dinner-logging',
        time: '18:00',
        title: 'Log Your Dinner! 🍽️',
        body: 'Don\'t forget to log your dinner for complete nutrition tracking.',
        type: 'meal-logging',
        actions: [
          { action: 'log-meal', title: 'Log Meal', icon: '🍽️' },
          { action: 'skip', title: 'Skip', icon: '⏭️' },
          { action: 'snooze', title: 'Snooze 15min', icon: '⏰' }
        ],
        enabled: true,
        snoozeEnabled: true,
        snoozeDuration: 15
      },
      {
        id: 'water-reminder',
        time: '21:00',
        title: 'Final Water Check! 💧',
        body: 'Time for your last water intake of the day.',
        type: 'water-reminder',
        actions: [
          { action: 'log-water', title: 'Log Water', icon: '💧' },
          { action: 'skip', title: 'Skip', icon: '⏭️' },
          { action: 'snooze', title: 'Snooze 10min', icon: '⏰' }
        ],
        enabled: true,
        snoozeEnabled: true,
        snoozeDuration: 10
      },
      {
        id: 'evening-journal',
        time: '22:00',
        title: 'Reflect on Your Day! 📝',
        body: 'Write down your wins, commitments, and plan for tomorrow.',
        type: 'evening-journal',
        actions: [
          { action: 'write-journal', title: 'Write Journal', icon: '📝' },
          { action: 'skip', title: 'Skip', icon: '⏭️' },
          { action: 'snooze', title: 'Snooze 15min', icon: '⏰' }
        ],
        enabled: true,
        snoozeEnabled: true,
        snoozeDuration: 15
      }
    ];

    for (const notification of defaultNotifications) {
      await this.scheduleNotification(notification);
    }
  }

  async scheduleNotification(notification: ScheduledNotification): Promise<void> {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    // Store notification in IndexedDB
    await this.storeNotification(notification);

    if (notification.enabled) {
      await this.scheduleNotificationTime(notification);
    }
  }

  private async scheduleNotificationTime(notification: ScheduledNotification): Promise<void> {
    const [hours, minutes] = notification.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    // Cancel existing timeout if any
    if (this.scheduledNotifications.has(notification.id)) {
      clearTimeout(this.scheduledNotifications.get(notification.id)!);
    }

    // Schedule the notification
    const timeoutId = setTimeout(() => {
      this.showScheduledNotification(notification);
    }, delay);

    this.scheduledNotifications.set(notification.id, timeoutId);

    console.log(`Notification "${notification.title}" scheduled for ${scheduledTime.toLocaleString()}`);
  }

  private async showScheduledNotification(notification: ScheduledNotification): Promise<void> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    try {
      const notificationOptions: any = {
        body: notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
          type: notification.type,
          notificationId: notification.id,
          actions: notification.actions,
          date: new Date().toISOString()
        },
        requireInteraction: true,
        tag: notification.id
      };

      if (notification.actions && notification.actions.length > 0) {
        notificationOptions.actions = notification.actions.map(action => ({
          action: action.action,
          title: action.title,
          icon: action.icon
        }));
      }

      await this.registration.showNotification(notification.title, notificationOptions);

      // Log the notification
      await this.logNotification(notification.id, notification.type);

      // Reschedule for tomorrow
      await this.scheduleNotificationTime(notification);
    } catch (error) {
      console.error('Failed to show scheduled notification:', error);
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    // Cancel the timeout
    if (this.scheduledNotifications.has(notificationId)) {
      clearTimeout(this.scheduledNotifications.get(notificationId)!);
      this.scheduledNotifications.delete(notificationId);
    }

    // Update in database
    await this.updateNotificationEnabled(notificationId, false);
  }

  async updateNotificationTime(notificationId: string, newTime: string): Promise<void> {
    const notification = await this.getNotification(notificationId);
    if (notification) {
      notification.time = newTime;
      await this.storeNotification(notification);
      
      // Reschedule
      if (notification.enabled) {
        await this.scheduleNotificationTime(notification);
      }
    }
  }

  async toggleNotification(notificationId: string, enabled: boolean): Promise<void> {
    const notification = await this.getNotification(notificationId);
    if (notification) {
      notification.enabled = enabled;
      await this.storeNotification(notification);
      
      if (enabled) {
        await this.scheduleNotificationTime(notification);
      } else {
        await this.cancelNotification(notificationId);
      }
    }
  }

  async handleNotificationClick(notificationId: string, action?: string): Promise<void> {
    // Log the click
    await this.logNotificationClick(notificationId, action);

    // Handle different actions
    switch (action) {
      case 'log-weight':
        window.location.href = '/dashboard/weight';
        break;
      case 'review-priorities':
        window.location.href = '/dashboard/priorities';
        break;
      case 'log-meal':
        window.location.href = '/dashboard/meals';
        break;
      case 'log-water':
        window.location.href = '/dashboard/water';
        break;
      case 'write-journal':
        window.location.href = '/dashboard/journal';
        break;
      case 'snooze':
        await this.snoozeNotification(notificationId);
        break;
      case 'skip':
        // Just log the skip, no action needed
        break;
      default:
        // Default behavior - navigate to dashboard
        window.location.href = '/dashboard';
    }
  }

  private async snoozeNotification(notificationId: string): Promise<void> {
    const notification = await this.getNotification(notificationId);
    if (notification && notification.snoozeEnabled) {
      const snoozeDelay = notification.snoozeDuration * 60 * 1000; // Convert to milliseconds
      
      setTimeout(() => {
        this.showScheduledNotification(notification);
      }, snoozeDelay);

      console.log(`Notification "${notification.title}" snoozed for ${notification.snoozeDuration} minutes`);
    }
  }

  // IndexedDB helper methods
  private async storeNotification(notification: ScheduledNotification): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notifications'], 'readwrite');
      const store = transaction.objectStore('notifications');
      
      const document: ScheduledNotificationDocument = {
        ...notification,
        userId: 'current-user', // TODO: Get from auth context
        actions: notification.actions || [],
        lastTriggered: undefined,
        nextTrigger: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const request = store.put(document);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getNotification(notificationId: string): Promise<ScheduledNotification | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notifications'], 'readonly');
      const store = transaction.objectStore('notifications');
      const request = store.get(notificationId);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async updateNotificationEnabled(notificationId: string, enabled: boolean): Promise<void> {
    const notification = await this.getNotification(notificationId);
    if (notification) {
      notification.enabled = enabled;
      await this.storeNotification(notification);
    }
  }

  private async logNotification(notificationId: string, type: NotificationType): Promise<void> {
    if (!this.db) return;

    const log: NotificationLog = {
      id: `${notificationId}-${Date.now()}`,
      userId: 'current-user', // TODO: Get from auth context
      notificationId,
      type,
      triggeredAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notificationLogs'], 'readwrite');
      const store = transaction.objectStore('notificationLogs');
      const request = store.add(log);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async logNotificationClick(notificationId: string, action?: string): Promise<void> {
    if (!this.db) return;

    // Find the most recent log for this notification
    const logs = await this.getNotificationLogs(notificationId);
    const latestLog = logs[logs.length - 1];
    
    if (latestLog) {
      latestLog.clickedAt = new Date();
      latestLog.actionTaken = action;

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['notificationLogs'], 'readwrite');
        const store = transaction.objectStore('notificationLogs');
        const request = store.put(latestLog);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  private async getNotificationLogs(notificationId: string): Promise<NotificationLog[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notificationLogs'], 'readonly');
      const store = transaction.objectStore('notificationLogs');
      const index = store.index('notificationId');
      const request = index.getAll(notificationId);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Legacy methods for backward compatibility
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async scheduleMorningNotification(wakeUpTime: string): Promise<void> {
    // Legacy method - now handled by scheduled notifications
    console.log('scheduleMorningNotification is deprecated. Use scheduled notifications instead.');
  }

  async showHydrationReminder(): Promise<void> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    try {
      await this.registration.showNotification('Stay Hydrated! 💧', {
        body: 'Time to drink some water and stay healthy',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
          type: 'water-reminder',
          date: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to show hydration reminder:', error);
    }
  }

  async showWeightReminder(): Promise<void> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    try {
      await this.registration.showNotification('Track Your Progress! ⚖️', {
        body: 'Don\'t forget to log your weight today',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
          type: 'weight-tracking',
          date: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to show weight reminder:', error);
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined') return 'default';
    return Notification.permission;
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance(); 
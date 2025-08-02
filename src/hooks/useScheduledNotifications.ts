import { useState, useEffect } from 'react';
import { notificationManager } from '@/lib/notification-manager';
import { ScheduledNotification } from '@/types';

export function useScheduledNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isInitialized, setIsInitialized] = useState(false);
  const [notifications, setNotifications] = useState<ScheduledNotification[]>([]);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      setIsSupported(notificationManager.isSupported());
      setPermission(notificationManager.getPermissionStatus());

      if (notificationManager.isSupported()) {
        await notificationManager.initialize();
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const newPermission = await notificationManager.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied' as NotificationPermission;
    }
  };

  const scheduleNotification = async (notification: ScheduledNotification) => {
    try {
      await notificationManager.scheduleNotification(notification);
      setNotifications(prev => [...prev, notification]);
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      await notificationManager.cancelNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      return true;
    } catch (error) {
      console.error('Error canceling notification:', error);
      return false;
    }
  };

  const updateNotificationTime = async (notificationId: string, newTime: string) => {
    try {
      await notificationManager.updateNotificationTime(notificationId, newTime);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, time: newTime } : n
      ));
      return true;
    } catch (error) {
      console.error('Error updating notification time:', error);
      return false;
    }
  };

  const toggleNotification = async (notificationId: string, enabled: boolean) => {
    try {
      await notificationManager.toggleNotification(notificationId, enabled);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, enabled } : n
      ));
      return true;
    } catch (error) {
      console.error('Error toggling notification:', error);
      return false;
    }
  };

  const testNotification = async (type: string) => {
    try {
      switch (type) {
        case 'weight-tracking':
          await notificationManager.showWeightReminder();
          break;
        case 'water-reminder':
          await notificationManager.showHydrationReminder();
          break;
        default:
          // Show a generic test notification
          if (notificationManager.isSupported()) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
              await registration.showNotification('Test Notification', {
                body: 'This is a test notification from your settings.',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png'
              });
            }
          }
      }
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  };

  const scheduleDailyNotifications = async () => {
    try {
      await notificationManager.scheduleDailyNotifications();
      return true;
    } catch (error) {
      console.error('Error scheduling daily notifications:', error);
      return false;
    }
  };

  return {
    isSupported,
    permission,
    isInitialized,
    notifications,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    updateNotificationTime,
    toggleNotification,
    testNotification,
    scheduleDailyNotifications
  };
} 
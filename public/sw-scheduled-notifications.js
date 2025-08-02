const CACHE_NAME = 'scheduled-notifications-v1';
const NOTIFICATION_CACHE = 'notification-assets-v1';

// Install event - cache notification assets
self.addEventListener('install', (event) => {
  console.log('Scheduled Notifications Service Worker installing...');
  
  event.waitUntil(
    caches.open(NOTIFICATION_CACHE).then((cache) => {
      return cache.addAll([
        '/icons/icon-192x192.png',
        '/icons/icon-72x72.png',
        '/icons/icon-512x512.png'
      ]);
    })
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Scheduled Notifications Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== NOTIFICATION_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Message event - handle notification scheduling commands
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { notification, delay } = event.data;
    scheduleNotification(notification, delay);
  } else if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
    const { notificationId } = event.data;
    cancelNotification(notificationId);
  } else if (event.data && event.data.type === 'SNOOZE_NOTIFICATION') {
    const { notification, snoozeDuration } = event.data;
    snoozeNotification(notification, snoozeDuration);
  }
});

// Notification click event - handle notification interactions
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.data);
  
  event.notification.close();
  
  const data = event.notification.data;
  const action = event.action;
  
  // Handle different notification actions
  let targetUrl = '/dashboard';
  
  if (action) {
    switch (action) {
      case 'log-weight':
        targetUrl = '/dashboard/weight';
        break;
      case 'review-priorities':
        targetUrl = '/dashboard/priorities';
        break;
      case 'log-meal':
        targetUrl = '/dashboard/meals';
        break;
      case 'log-water':
        targetUrl = '/dashboard/water';
        break;
      case 'write-journal':
        targetUrl = '/dashboard/journal';
        break;
      case 'snooze':
        // Handle snooze in the main thread
        event.waitUntil(
          self.clients.matchAll().then((clients) => {
            if (clients.length > 0) {
              clients[0].postMessage({
                type: 'SNOOZE_NOTIFICATION',
                notificationId: data.notificationId,
                snoozeDuration: 10 // Default 10 minutes
              });
            }
          })
        );
        return;
      case 'skip':
        // Just close the notification
        return;
      default:
        targetUrl = '/dashboard';
    }
  }
  
  // Open the target URL
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no existing window/tab, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Background sync event - handle offline notifications
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(syncOfflineNotifications());
  }
});

// Store for scheduled notifications
const scheduledNotifications = new Map();

// Schedule a notification
function scheduleNotification(notification, delay) {
  console.log('Scheduling notification:', notification.title, 'for', delay, 'ms');
  
  const timeoutId = setTimeout(() => {
    showNotification(notification);
  }, delay);
  
  scheduledNotifications.set(notification.id, timeoutId);
}

// Cancel a scheduled notification
function cancelNotification(notificationId) {
  console.log('Canceling notification:', notificationId);
  
  const timeoutId = scheduledNotifications.get(notificationId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    scheduledNotifications.delete(notificationId);
  }
}

// Snooze a notification
function snoozeNotification(notification, snoozeDuration) {
  console.log('Snoozing notification:', notification.title, 'for', snoozeDuration, 'minutes');
  
  const snoozeDelay = snoozeDuration * 60 * 1000; // Convert to milliseconds
  
  setTimeout(() => {
    showNotification(notification);
  }, snoozeDelay);
}

// Show a notification
async function showNotification(notification) {
  console.log('Showing notification:', notification.title);
  
  try {
    const options = {
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
      options.actions = notification.actions.map(action => ({
        action: action.action,
        title: action.title,
        icon: action.icon
      }));
    }
    
    await self.registration.showNotification(notification.title, options);
    
    // Log the notification
    logNotification(notification.id, notification.type);
    
  } catch (error) {
    console.error('Failed to show notification:', error);
    
    // If notification fails, queue it for later
    queueOfflineNotification(notification);
  }
}

// Log notification to IndexedDB
async function logNotification(notificationId, type) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(['notificationLogs'], 'readwrite');
    const store = transaction.objectStore('notificationLogs');
    
    const log = {
      id: `${notificationId}-${Date.now()}`,
      userId: 'current-user', // TODO: Get from auth context
      notificationId,
      type,
      triggeredAt: new Date()
    };
    
    await store.add(log);
  } catch (error) {
    console.error('Failed to log notification:', error);
  }
}

// Queue notification for offline delivery
async function queueOfflineNotification(notification) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(['offlineNotifications'], 'readwrite');
    const store = transaction.objectStore('offlineNotifications');
    
    const offlineNotification = {
      id: `${notification.id}-${Date.now()}`,
      notification,
      queuedAt: new Date()
    };
    
    await store.add(offlineNotification);
  } catch (error) {
    console.error('Failed to queue offline notification:', error);
  }
}

// Sync offline notifications
async function syncOfflineNotifications() {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(['offlineNotifications'], 'readwrite');
    const store = transaction.objectStore('offlineNotifications');
    
    const offlineNotifications = await store.getAll();
    
    for (const offlineNotification of offlineNotifications) {
      try {
        await showNotification(offlineNotification.notification);
        await store.delete(offlineNotification.id);
      } catch (error) {
        console.error('Failed to sync offline notification:', error);
      }
    }
  } catch (error) {
    console.error('Failed to sync offline notifications:', error);
  }
}

// Open IndexedDB
function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotificationDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create offline notifications store if it doesn't exist
      if (!db.objectStoreNames.contains('offlineNotifications')) {
        const offlineStore = db.createObjectStore('offlineNotifications', { keyPath: 'id' });
        offlineStore.createIndex('queuedAt', 'queuedAt', { unique: false });
      }
    };
  });
}

// Periodic background sync for notifications
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync event:', event.tag);
  
  if (event.tag === 'notification-check') {
    event.waitUntil(checkScheduledNotifications());
  }
});

// Check for scheduled notifications
async function checkScheduledNotifications() {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(['notifications'], 'readonly');
    const store = transaction.objectStore('notifications');
    
    const notifications = await store.getAll();
    const now = new Date();
    
    for (const notification of notifications) {
      if (notification.enabled) {
        const [hours, minutes] = notification.time.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // If it's time for this notification
        if (Math.abs(scheduledTime.getTime() - now.getTime()) < 60000) { // Within 1 minute
          await showNotification(notification);
        }
      }
    }
  } catch (error) {
    console.error('Failed to check scheduled notifications:', error);
  }
}

console.log('Scheduled Notifications Service Worker loaded'); 
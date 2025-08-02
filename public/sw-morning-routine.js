// Morning Routine Service Worker
const CACHE_NAME = 'morning-routine-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/morning-routine',
  '/dashboard/weight',
  '/dashboard/water'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: 'Time to start your healthy morning routine!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      type: 'morning-routine',
      date: new Date().toISOString()
    },
    actions: [
      {
        action: 'log-weight',
        title: 'Log Weight',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'drink-water',
        title: 'Drink Water',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'snooze',
        title: 'Snooze 10min',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Good Morning! 🌅', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'log-weight') {
    event.waitUntil(
      clients.openWindow('/dashboard/weight')
    );
  } else if (event.action === 'drink-water') {
    event.waitUntil(
      clients.openWindow('/dashboard/water')
    );
  } else if (event.action === 'snooze') {
    // Schedule notification for 10 minutes later
    setTimeout(() => {
      self.registration.showNotification('Good Morning! 🌅 (Reminder)', {
        body: 'Time to start your healthy morning routine!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200]
      });
    }, 10 * 60 * 1000); // 10 minutes
  } else {
    // Default action - open morning routine page
    event.waitUntil(
      clients.openWindow('/dashboard/morning-routine')
    );
  }
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'morning-routine-sync') {
    event.waitUntil(
      // Sync any pending data when connection is restored
      console.log('Syncing morning routine data...')
    );
  }
}); 
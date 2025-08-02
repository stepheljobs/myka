# Scheduled Notifications Implementation

## Overview

This document outlines the implementation of the scheduled notifications feature for the MyKa PWA. The feature provides a comprehensive daily notification system that sends 6 scheduled reminders throughout the day to help users maintain their health and productivity routines.

## Architecture

### Core Components

1. **NotificationManager** (`src/lib/notification-manager.ts`)
   - Enhanced notification manager with IndexedDB storage
   - Scheduled notification functionality
   - Notification persistence and management

2. **Service Worker** (`public/sw-scheduled-notifications.js`)
   - Background notification scheduling
   - Offline notification queuing
   - Notification action handling

3. **Database Services**
   - `ScheduledNotificationsService` (`src/lib/scheduled-notifications-service.ts`)
   - `MealService` (`src/lib/meal-service.ts`)
   - `PriorityService` (`src/lib/priority-service.ts`)

4. **API Routes**
   - `/api/meals/*` - Meal logging endpoints
   - `/api/priorities/*` - Priority management endpoints
   - `/api/notifications/scheduled/*` - Scheduled notifications endpoints

5. **User Interface**
   - Notification Settings (`src/app/settings/notifications/page.tsx`)
   - Meal Logging (`src/app/dashboard/meals/page.tsx`)
   - Priority Management (`src/app/dashboard/priorities/page.tsx`)

## Notification Schedule

| Time | Type | Purpose | Actions |
|------|------|---------|---------|
| 6:00 AM | Weight Tracking | Log weight before water intake | Log Weight, Skip, Snooze |
| 6:30 AM | Priority Review | Set top 3 priorities for the day | Review Priorities, Skip, Snooze |
| 12:00 PM | Meal Logging | Log lunch foods and nutrition | Log Meal, Skip, Snooze |
| 6:00 PM | Meal Logging | Log dinner foods and nutrition | Log Meal, Skip, Snooze |
| 9:00 PM | Water Reminder | Final water intake check | Log Water, Skip, Snooze |
| 10:00 PM | Evening Journal | Reflect on day and plan tomorrow | Write Journal, Skip, Snooze |

## Features Implemented

### ✅ Phase 1: Core Infrastructure
- [x] Enhanced Notification Manager with IndexedDB storage
- [x] New Service Worker for scheduled notifications
- [x] Database schema for scheduled notifications, meal logs, and priorities
- [x] Notification persistence and management

### ✅ Phase 2: Notification Types
- [x] Weight tracking notification (6:00 AM)
- [x] Priority review notification (6:30 AM)
- [x] Meal logging notifications (12:00 PM, 6:00 PM)
- [x] Water reminder notification (9:00 PM)
- [x] Evening journal notification (10:00 PM)

### ✅ Phase 3: User Interface
- [x] Notification settings page with time pickers
- [x] Meal logging interface with food search
- [x] Priority management interface
- [x] Updated bottom navigation

### ✅ Phase 4: Integration & Testing
- [x] API routes for all new features
- [x] Custom hooks for notification management
- [x] Testing scripts for notifications
- [x] Integration with existing features

## Technical Implementation

### Notification Manager

The enhanced `NotificationManager` class provides:

```typescript
class NotificationManager {
  // Core methods
  async initialize(): Promise<void>
  async scheduleDailyNotifications(): Promise<void>
  async scheduleNotification(notification: ScheduledNotification): Promise<void>
  async cancelNotification(notificationId: string): Promise<void>
  async updateNotificationTime(notificationId: string, newTime: string): Promise<void>
  async toggleNotification(notificationId: string, enabled: boolean): Promise<void>
  async handleNotificationClick(notificationId: string, action?: string): Promise<void>
}
```

### Service Worker Features

- **Background Scheduling**: Uses `setTimeout` and `setInterval` for reliable scheduling
- **Offline Support**: Queues notifications when offline, syncs when connection restored
- **Action Handling**: Processes notification clicks and actions
- **Snooze Functionality**: Allows users to snooze notifications for specified duration

### Database Schema

#### ScheduledNotifications Collection
```typescript
interface ScheduledNotificationDocument {
  id: string;
  userId: string;
  time: string; // HH:MM format
  title: string;
  body: string;
  type: NotificationType;
  actions: NotificationAction[];
  enabled: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number;
  lastTriggered?: Date;
  nextTrigger?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### MealLogs Collection
```typescript
interface MealLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Priorities Collection
```typescript
interface Priority {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3; // Top 3 priorities
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}
```

## User Experience Flow

### Morning Flow (6:00 AM - 6:30 AM)
1. **6:00 AM**: Weight tracking notification
   - User receives notification with "Log Weight" action
   - Tapping opens weight tracking page
   - Weight logged before water intake

2. **6:30 AM**: Priority review notification
   - User receives notification with "Review Priorities" action
   - Tapping opens priority management page
   - User sets top 3 priorities for the day

### Daytime Flow (12:00 PM - 6:00 PM)
3. **12:00 PM**: Lunch meal logging
   - User receives notification with "Log Meal" action
   - Tapping opens meal logging form
   - User logs lunch foods and nutrition

4. **6:00 PM**: Dinner meal logging
   - User receives notification with "Log Meal" action
   - Tapping opens meal logging form
   - User logs dinner foods and nutrition

### Evening Flow (9:00 PM - 10:00 PM)
5. **9:00 PM**: Final water intake
   - User receives notification with "Log Water" action
   - Tapping opens quick water logging
   - User logs final water intake for the day

6. **10:00 PM**: Evening journaling
   - User receives notification with "Write Journal" action
   - Tapping opens journal entry form
   - User writes wins, commitments, and tomorrow's plans

## API Endpoints

### Meal Logging
- `GET /api/meals?date={date}&mealType={type}` - Get meal logs
- `POST /api/meals` - Create meal log
- `GET /api/meals/{id}` - Get specific meal log
- `PUT /api/meals/{id}` - Update meal log
- `DELETE /api/meals/{id}` - Delete meal log
- `GET /api/meals/search?q={query}` - Search foods

### Priority Management
- `GET /api/priorities?date={date}` - Get priorities
- `POST /api/priorities` - Create priority
- `GET /api/priorities/{id}` - Get specific priority
- `PUT /api/priorities/{id}` - Update priority
- `DELETE /api/priorities/{id}` - Delete priority
- `POST /api/priorities/{id}/toggle` - Toggle completion

### Scheduled Notifications
- `GET /api/notifications/scheduled` - Get scheduled notifications
- `POST /api/notifications/scheduled` - Create scheduled notification

## Testing

### Manual Testing
1. Navigate to `/settings/notifications`
2. Configure notification times and settings
3. Use "Test" buttons to verify notifications
4. Check notification actions work correctly

### Automated Testing
Run the testing script:
```bash
node scripts/test-scheduled-notifications.js
```

### Browser Testing
- Test on Chrome, Firefox, Safari
- Verify PWA installation and offline functionality
- Check notification permissions and handling

## Performance Considerations

### Battery Optimization
- Efficient notification scheduling algorithm
- Minimal background processing
- Respect system battery optimization settings

### Storage Optimization
- IndexedDB for local notification storage
- Efficient data structures for notification management
- Regular cleanup of old notification logs

### Network Optimization
- Offline notification queuing
- Background sync when connection restored
- Efficient API calls with proper caching

## Security & Privacy

### Data Protection
- User data stored securely in Firestore
- Local notification data in IndexedDB
- No sensitive data in notification content

### Permission Handling
- Graceful fallback when notifications disabled
- Clear permission request flow
- Respect user privacy preferences

## Future Enhancements

### Phase 2 Features (Post-Launch)
- [ ] Custom notification times per user
- [ ] Notification sound customization
- [ ] Advanced snooze options
- [ ] Notification analytics dashboard
- [ ] Integration with health apps
- [ ] Smart notification timing based on user behavior

### Advanced Features
- [ ] AI-powered meal suggestions
- [ ] Nutrition goal tracking
- [ ] Priority completion analytics
- [ ] Habit streak tracking
- [ ] Social sharing of achievements
- [ ] Integration with calendar apps

## Troubleshooting

### Common Issues

1. **Notifications not showing**
   - Check browser notification permissions
   - Verify service worker registration
   - Check console for errors

2. **Scheduled notifications not triggering**
   - Verify notification times are set correctly
   - Check if notifications are enabled
   - Ensure service worker is active

3. **Notification actions not working**
   - Verify service worker handles click events
   - Check navigation URLs are correct
   - Test notification action handling

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'notifications');
```

## Conclusion

The scheduled notifications feature provides a comprehensive solution for helping users maintain consistent daily routines. The implementation follows best practices for PWA development, includes proper error handling, and provides a smooth user experience across different devices and browsers.

The modular architecture allows for easy extension and maintenance, while the comprehensive testing ensures reliability and performance. 
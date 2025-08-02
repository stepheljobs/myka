# Scheduled Notifications Feature Specification

## Overview

This feature implements a comprehensive daily notification system that sends 6 scheduled reminders throughout the day to help users maintain their health and productivity routines. The notifications are designed to create a structured daily flow that supports weight tracking, hydration, meal logging, priority management, and evening reflection.

## Feature Goals

- **Health Tracking Support**: Ensure users don't forget to log weight and water intake
- **Meal Awareness**: Promote mindful eating through meal logging reminders
- **Productivity Enhancement**: Help users stay focused on their top priorities
- **Evening Reflection**: Encourage daily journaling and tomorrow planning
- **Consistency Building**: Create a reliable daily routine through timely reminders

## Notification Schedule

| Time | Purpose | Action | Priority |
|------|---------|--------|----------|
| 6:00 AM | Weight tracking reminder | Log weight before water intake | High |
| 6:30 AM | Priority review | Review top 3 priorities for the day | High |
| 12:00 PM | Lunch meal logging | Log lunch foods and nutrition | Medium |
| 6:00 PM | Dinner meal logging | Log dinner foods and nutrition | Medium |
| 9:00 PM | Final water intake | Last water intake reminder | Medium |
| 10:00 PM | Evening journaling | Write wins, commitments, and tomorrow's plans | High |

## Technical Requirements

### 1. Enhanced Notification Manager

#### New Methods to Add:
```typescript
interface ScheduledNotification {
  id: string;
  time: string; // HH:MM format
  title: string;
  body: string;
  type: NotificationType;
  actions?: NotificationAction[];
  enabled: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

type NotificationType = 
  | 'weight-tracking'
  | 'priority-review'
  | 'meal-logging'
  | 'water-reminder'
  | 'evening-journal'
  | 'custom';
```

#### Core Methods:
- `scheduleDailyNotifications()`: Schedule all daily notifications
- `scheduleNotification(notification: ScheduledNotification)`: Schedule individual notification
- `cancelNotification(notificationId: string)`: Cancel specific notification
- `updateNotificationTime(notificationId: string, newTime: string)`: Update notification time
- `toggleNotification(notificationId: string, enabled: boolean)`: Enable/disable notification
- `handleNotificationClick(notificationId: string, action?: string)`: Handle notification interactions

### 2. Service Worker Enhancements

#### New Service Worker: `sw-scheduled-notifications.js`

**Features:**
- Background notification scheduling using `setTimeout` and `setInterval`
- Persistent notification storage using IndexedDB
- Offline notification queuing
- Notification action handling
- Snooze functionality

**Key Events:**
- `install`: Cache notification assets
- `activate`: Clean up old caches
- `message`: Handle notification scheduling commands
- `notificationclick`: Handle notification interactions
- `sync`: Background sync for offline notifications

### 3. Database Schema Updates

#### New Collections:

**ScheduledNotifications**
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

**NotificationLogs**
```typescript
interface NotificationLog {
  id: string;
  userId: string;
  notificationId: string;
  type: NotificationType;
  triggeredAt: Date;
  clickedAt?: Date;
  actionTaken?: string;
  snoozed?: boolean;
  snoozeDuration?: number;
}
```

**MealLogs** (New Feature)
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

interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}
```

### 4. User Settings & Preferences

#### Enhanced UserPreferences Interface:
```typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  scheduledNotifications: {
    enabled: boolean;
    times: {
      weightTracking: string; // "06:00"
      priorityReview: string; // "06:30"
      lunchLogging: string; // "12:00"
      dinnerLogging: string; // "18:00"
      waterReminder: string; // "21:00"
      eveningJournal: string; // "22:00"
    };
    snoozeEnabled: boolean;
    snoozeDuration: number; // minutes
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  offlineMode: boolean;
  dataSync: boolean;
}
```

## Implementation Tasks

### Phase 1: Core Infrastructure (Week 1)

#### Task 1.1: Enhanced Notification Manager
- [ ] Extend `NotificationManager` class with scheduled notification methods
- [ ] Add IndexedDB storage for notification persistence
- [ ] Implement notification scheduling logic
- [ ] Add notification cancellation and update methods

**Files to modify:**
- `src/lib/notification-manager.ts`
- `src/types/index.ts` (add new interfaces)

#### Task 1.2: New Service Worker
- [ ] Create `public/sw-scheduled-notifications.js`
- [ ] Implement background notification scheduling
- [ ] Add notification action handling
- [ ] Implement snooze functionality

#### Task 1.3: Database Schema
- [ ] Create Firestore collections for scheduled notifications
- [ ] Add notification logging collection
- [ ] Create meal logging collection
- [ ] Update user preferences schema

### Phase 2: Notification Types Implementation (Week 2)

#### Task 2.1: Weight Tracking Notification (6:00 AM)
- [ ] Create weight tracking notification template
- [ ] Add action buttons: "Log Weight", "Skip", "Snooze"
- [ ] Implement direct navigation to weight tracking page
- [ ] Add completion tracking

#### Task 2.2: Priority Review Notification (6:30 AM)
- [ ] Create priority review notification template
- [ ] Add action buttons: "Review Priorities", "Skip", "Snooze"
- [ ] Implement navigation to priority management
- [ ] Add priority completion tracking

#### Task 2.3: Meal Logging Notifications (12:00 PM, 6:00 PM)
- [ ] Create meal logging notification templates
- [ ] Add action buttons: "Log Meal", "Skip", "Snooze"
- [ ] Implement meal logging interface
- [ ] Add nutrition tracking capabilities

#### Task 2.4: Water Reminder (9:00 PM)
- [ ] Create water reminder notification template
- [ ] Add action buttons: "Log Water", "Skip", "Snooze"
- [ ] Implement quick water logging
- [ ] Add daily water goal tracking

#### Task 2.5: Evening Journal Notification (10:00 PM)
- [ ] Create evening journal notification template
- [ ] Add action buttons: "Write Journal", "Skip", "Snooze"
- [ ] Implement journal entry creation
- [ ] Add tomorrow planning prompts

### Phase 3: User Interface & Settings (Week 3)

#### Task 3.1: Notification Settings Page
- [ ] Create notification settings UI
- [ ] Add time picker for each notification
- [ ] Implement enable/disable toggles
- [ ] Add snooze settings configuration

**Files to create:**
- `src/app/settings/notifications/page.tsx`
- `src/components/NotificationSettings.tsx`

#### Task 3.2: Meal Logging Interface
- [ ] Create meal logging form
- [ ] Add food search/autocomplete
- [ ] Implement nutrition calculation
- [ ] Add meal history view

**Files to create:**
- `src/app/dashboard/meals/page.tsx`
- `src/components/MealLoggingForm.tsx`
- `src/components/MealHistory.tsx`

#### Task 3.3: Priority Management
- [ ] Create priority management interface
- [ ] Add priority creation and editing
- [ ] Implement priority completion tracking
- [ ] Add priority history view

**Files to create:**
- `src/app/dashboard/priorities/page.tsx`
- `src/components/PriorityManager.tsx`

### Phase 4: Integration & Testing (Week 4)

#### Task 4.1: Service Integration
- [ ] Integrate notification system with existing features
- [ ] Update morning routine to work with new notifications
- [ ] Connect meal logging with weight tracking
- [ ] Link priority management with daily progress

#### Task 4.2: Testing & Debugging
- [ ] Create notification testing suite
- [ ] Test offline notification behavior
- [ ] Verify notification persistence
- [ ] Test snooze functionality

#### Task 4.3: Performance Optimization
- [ ] Optimize notification scheduling
- [ ] Implement efficient background sync
- [ ] Add notification analytics
- [ ] Optimize battery usage

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

## Notification Content Templates

### Weight Tracking (6:00 AM)
```
Title: "Time to Track Your Progress! ⚖️"
Body: "Start your day by logging your weight before your first glass of water."
Actions: ["Log Weight", "Skip", "Snooze 10min"]
```

### Priority Review (6:30 AM)
```
Title: "Set Your Top 3 Priorities! 🎯"
Body: "Review and set your most important goals for today."
Actions: ["Review Priorities", "Skip", "Snooze 10min"]
```

### Lunch Logging (12:00 PM)
```
Title: "Log Your Lunch! 🍽️"
Body: "Keep track of your nutrition by logging what you ate for lunch."
Actions: ["Log Meal", "Skip", "Snooze 15min"]
```

### Dinner Logging (6:00 PM)
```
Title: "Log Your Dinner! 🍽️"
Body: "Don't forget to log your dinner for complete nutrition tracking."
Actions: ["Log Meal", "Skip", "Snooze 15min"]
```

### Water Reminder (9:00 PM)
```
Title: "Final Water Check! 💧"
Body: "Time for your last water intake of the day."
Actions: ["Log Water", "Skip", "Snooze 10min"]
```

### Evening Journal (10:00 PM)
```
Title: "Reflect on Your Day! 📝"
Body: "Write down your wins, commitments, and plan for tomorrow."
Actions: ["Write Journal", "Skip", "Snooze 15min"]
```

## Error Handling & Edge Cases

### Notification Permission Issues
- Graceful fallback when notifications are disabled
- Clear instructions for enabling notifications
- Alternative reminder methods (in-app notifications)

### Time Zone Handling
- Store times in user's local timezone
- Handle daylight saving time changes
- Provide timezone selection in settings

### Offline Scenarios
- Queue notifications when offline
- Sync when connection is restored
- Show offline status indicator

### Battery Optimization
- Respect system battery optimization settings
- Provide manual notification trigger option
- Implement efficient background processing

## Success Metrics

### User Engagement
- Notification open rate (target: >70%)
- Action completion rate (target: >60%)
- Daily notification streak (target: >5 days/week)

### Health Tracking
- Weight logging consistency (target: >80%)
- Water intake logging (target: >70%)
- Meal logging completion (target: >60%)

### Productivity
- Priority review completion (target: >75%)
- Evening journaling consistency (target: >65%)
- Overall daily routine adherence (target: >70%)

## Future Enhancements

### Phase 2 Features (Post-Launch)
- Custom notification times per user
- Notification sound customization
- Advanced snooze options
- Notification analytics dashboard
- Integration with health apps
- Smart notification timing based on user behavior

### Advanced Features
- AI-powered meal suggestions
- Nutrition goal tracking
- Priority completion analytics
- Habit streak tracking
- Social sharing of achievements
- Integration with calendar apps

## Technical Considerations

### Performance
- Efficient notification scheduling algorithm
- Minimal battery impact
- Fast notification delivery
- Optimized background processing

### Security
- Secure notification data storage
- User privacy protection
- Secure API endpoints
- Data encryption in transit and at rest

### Accessibility
- Screen reader support
- High contrast mode
- Large text support
- Voice navigation compatibility

### Cross-Platform Compatibility
- iOS Safari support
- Android Chrome support
- Desktop browser support
- Progressive Web App compatibility

## Conclusion

This scheduled notifications feature will significantly enhance user engagement and help build consistent daily routines. By providing timely, contextual reminders throughout the day, users will be more likely to maintain their health tracking, productivity, and reflection habits.

The implementation follows a phased approach to ensure quality delivery while allowing for iterative improvements based on user feedback and usage analytics. 
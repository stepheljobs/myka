# Dailies Feature Specification

## Overview
A comprehensive daily tracking feature that allows users to monitor key health and wellness metrics on a daily basis. The Dailies feature provides a structured way to track sleep quality, weight, workouts, steps, stress levels, fatigue, hunger, goal review, and planning habits.

## User Stories

### Primary User Story
**As a user**
I want to track my daily health and wellness metrics in one place
**So that** I can monitor my progress and maintain healthy habits

### Supporting User Stories
1. **As a user**
   I want to rate my sleep quality from 1-5
   **So that** I can track sleep patterns and identify factors affecting my rest

2. **As a user**
   I want to log my morning weight
   **So that** I can track my weight progress over time

3. **As a user**
   I want to mark whether I worked out today
   **So that** I can maintain consistency in my fitness routine

4. **As a user**
   I want to log my daily step count
   **So that** I can ensure I'm meeting my activity goals

5. **As a user**
   I want to rate my stress, fatigue, and hunger levels
   **So that** I can identify patterns and make lifestyle adjustments

6. **As a user**
   I want to track my goal review and planning habits
   **So that** I can maintain focus on my long-term objectives

## Core Features

### 1. Daily Metrics Tracking
- **Sleep Quality**: 1-5 rating scale with descriptive labels
- **Weight**: Integration with existing weight tracking system
- **Workout**: Boolean checkbox for daily workout completion
- **Steps**: Numeric input for daily step count
- **Stress Level**: 1-5 rating scale
- **Fatigue Level**: 1-5 rating scale
- **Hunger Level**: 1-5 rating scale
- **Goal Review**: Boolean checkbox for daily goal review
- **Tomorrow Planning**: Boolean checkbox for planning next day

### 2. User Interface
- **Dashboard Integration**: New dailies card on main dashboard
- **Dedicated Dailies Page**: Full-page daily tracking experience
- **Date Navigation**: View and edit previous entries
- **Progress Visualization**: Charts and trends for each metric
- **Quick Entry**: Streamlined interface for daily logging

### 3. Data Management
- **Firestore Integration**: Store entries in `daily_entries` collection
- **Offline Support**: Work offline with sync when connection restored
- **Real-time Updates**: Live updates across devices


## Technical Implementation

### Data Models

```typescript
export interface DailyEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  sleepQuality: number; // 1-5
  weight?: number; // Optional, links to weight tracking
  workoutCompleted: boolean;
  steps: number;
  stressLevel: number; // 1-5
  fatigueLevel: number; // 1-5
  hungerLevel: number; // 1-5
  goalReviewCompleted: boolean;
  tomorrowPlanningCompleted: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyStats {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  hasEntry: boolean;
  completionRate: number; // Percentage of metrics logged
}

export interface DailyTrends {
  userId: string;
  dateRange: {
    start: string;
    end: string;
  };
  sleepQuality: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  workoutFrequency: {
    percentage: number;
    streak: number;
  };
  steps: {
    average: number;
    total: number;
    goalMet: boolean;
  };
  stressLevel: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  fatigueLevel: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  hungerLevel: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  goalReviewFrequency: {
    percentage: number;
    streak: number;
  };
  planningFrequency: {
    percentage: number;
    streak: number;
  };
}
```

### API Endpoints

1. **GET /api/dailies/today** - Get today's entry
2. **GET /api/dailies/date/[date]** - Get entry for specific date
3. **POST /api/dailies/entry** - Create/update today's entry
4. **PUT /api/dailies/entry/[id]** - Update specific entry
5. **GET /api/dailies/stats/[date]** - Get daily statistics
6. **GET /api/dailies/trends** - Get trends for date range
7. **GET /api/dailies/history** - Get recent entries

### File Structure

```
src/
├── app/
│   ├── api/
│   │   └── dailies/
│   │       ├── entry/
│   │       │   └── route.ts
│   │       ├── today/
│   │       │   └── route.ts
│   │       ├── date/
│   │       │   └── [date]/
│   │       │       └── route.ts
│   │       ├── stats/
│   │       │   └── [date]/
│   │       │       └── route.ts
│   │       ├── trends/
│   │       │   └── route.ts
│   │       ├── history/
│   │       │   └── route.ts
│   └── dashboard/
│       └── dailies/
│           ├── page.tsx
│           ├── [date]/
│           │   └── page.tsx
│           └── components/
│               ├── DailyEntryForm.tsx
│               ├── DailyStats.tsx
│               ├── DailyTrends.tsx
│               ├── DateNavigator.tsx
│               └── MetricCard.tsx
├── components/
│   └── ui/
│       └── DailiesCard.tsx
├── hooks/
│   └── useDailies.ts
├── lib/
│   └── dailies-service.ts
└── types/
    └── index.ts (add dailies types)
```

### UI Components

1. **DailiesCard** (Dashboard)
   - Shows today's completion status
   - Quick access to daily entry
   - Streak indicator
   - Completion percentage

2. **DailyEntryForm** (Main Component)
   - Form with all 9 daily metrics
   - Rating scales for subjective metrics
   - Checkboxes for boolean metrics
   - Numeric inputs for objective metrics
   

3. **MetricCard**
   - Individual metric display
   - Rating visualization
   - Progress indicators
   - Historical context

4. **DailyStats**
   - Completion rate
   - Streak counter
   - Total entries
   - Quick insights

5. **DailyTrends**
   - Charts for each metric
   - Trend analysis
   - Goal progress
   - Weekly/monthly summaries

6. **DateNavigator**
   - Calendar-style navigation
   - Previous/next day buttons
   - Entry status indicators
   - Quick date selection

## User Experience

### Dashboard Integration
- Add dailies card to main dashboard
- Show completion status for today
- Display current streak
- Quick "Log Dailies" button
- Visual progress indicators

### Dailies Page
- Clean, organized interface
- Logical grouping of related metrics
- Intuitive rating scales with descriptions
- Quick input methods

- Date picker for viewing past entries
- Statistics and trends sidebar

### Mobile-First Design
- Touch-friendly interface
- Responsive form elements
- Easy navigation between dates
- Offline capability
- Swipe gestures for date navigation

### Rating Scale Descriptions
- **Sleep Quality**: 1=Poor, 2=Fair, 3=Good, 4=Very Good, 5=Excellent
- **Stress Level**: 1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Very High
- **Fatigue Level**: 1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Very High
- **Hunger Level**: 1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Very High

## Features by Phase

### Phase 1: Core Functionality (Week 1-2)
- [ ] Data models and types
- [ ] Firestore service methods
- [ ] API endpoints
- [ ] Basic dailies page
- [ ] Create/update entries
- [ ] Integration with existing weight tracking

### Phase 2: Dashboard Integration (Week 3)
- [ ] Dailies card component
- [ ] Dashboard integration
- [ ] Quick entry functionality
- [ ] Basic statistics
- [ ] Completion tracking

### Phase 3: Enhanced Features (Week 4)
- [ ] Date navigation
- [ ] Entry history
- [ ] Statistics and insights
- [ ] Trend analysis

### Phase 4: Polish & Analytics (Week 5-6)

- [ ] Offline support

- [ ] Advanced charts and trends
- [ ] Goal setting and tracking
- [ ] Notifications/reminders

## Integration with Existing Features

### Weight Tracking Integration
- Link daily weight entries to existing weight tracking system
- Share weight data between features
- Maintain consistency in weight logging
- Provide quick access to weight history

### Morning Routine Integration
- Include dailies completion in morning routine
- Add dailies logging as a morning routine task
- Track completion of both features together
- Provide unified progress tracking

### Journal Integration
- Allow notes in daily entries
- Link daily metrics to journal entries
- Provide context for daily reflections
- Enable cross-feature insights

## Success Metrics
- Daily active users for dailies tracking
- Entry completion rate
- User retention with dailies
- Streak maintenance rates
- Data consistency across features
- User engagement with trends and insights

## Future Enhancements
- Customizable metrics
- Goal setting for each metric
- Integration with fitness trackers
- AI-powered insights and recommendations
- Social features and challenges
- Advanced analytics and reporting

- Custom rating scales
- Metric correlations and insights

## Technical Considerations

### Performance
- Implement efficient data queries
- Use pagination for historical data
- Optimize chart rendering
- Cache frequently accessed data

### Data Validation
- Validate rating scales (1-5)
- Ensure numeric inputs are positive
- Validate date formats
- Handle missing data gracefully

### Offline Support
- Store entries locally when offline
- Sync when connection restored
- Handle conflicts appropriately
- Provide offline indicators

### Security
- Validate user permissions
- Sanitize all inputs
- Protect sensitive health data
- Implement proper authentication

## Dependencies

### New Dependencies Required
```json
{
  "dependencies": {
    "recharts": "^2.8.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0"
  }
}
```

## Testing Strategy

### Unit Tests
- Data model validation
- API endpoint functionality
- Form validation logic
- Utility functions

### Integration Tests
- Firebase operations
- Cross-feature integration
- Offline functionality
- Data synchronization

### E2E Tests
- Complete daily entry flow
- Date navigation
- Data persistence
- Cross-device synchronization

## Conclusion

The Dailies feature will provide users with a comprehensive daily tracking system that integrates seamlessly with existing features while offering valuable insights into their health and wellness patterns. The structured approach to daily metrics will help users maintain consistency and identify trends that can inform their lifestyle choices. 
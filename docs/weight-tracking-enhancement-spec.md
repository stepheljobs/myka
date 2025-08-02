# Weight Tracking Enhancement Specification

## Overview
This specification outlines the enhancement of the existing weight tracking feature to provide users with comprehensive daily weight viewing capabilities and trend visualization through line charts. The feature will build upon the existing weight tracking infrastructure to deliver a more insightful and user-friendly experience.

## User Stories

### Primary User Stories
1. **As a user**
   I want to view my logged weight for today, yesterday, and other specific days
   **So that** I can track my daily progress and compare my weight across different time periods

2. **As a user**
   I want to view the trend of my weight in a line chart format for the past 7 days
   **So that** I can visualize my weight progression and identify patterns in my weight management journey

### Supporting User Stories
3. **As a user**
   I want to see my weight entries in a calendar-like view
   **So that** I can quickly identify which days I logged my weight and which days I missed

4. **As a user**
   I want to filter my weight history by date ranges
   **So that** I can focus on specific periods of my weight tracking journey

5. **As a user**
   I want to export my weight data for external analysis
   **So that** I can share my progress with healthcare providers or use other analysis tools

6. **As a user**
   I want to set weight goals and see my progress towards them
   **So that** I can stay motivated and track my achievements

## Technical Requirements

### Core Features

#### 1. Daily Weight Viewing
- **Daily Weight Display**: Show today's weight prominently with comparison to previous day
- **Historical Daily View**: Allow users to select any date and view the weight logged for that day
- **Missing Days Indicator**: Clearly show which days don't have weight entries
- **Quick Navigation**: Easy navigation between days (previous/next day buttons)

#### 2. Weight Trend Visualization
- **7-Day Line Chart**: Interactive line chart showing weight trends over the past 7 days
- **Chart Customization**: Allow users to adjust the time range (7, 14, 30 days)
- **Trend Analysis**: Display trend direction (increasing, decreasing, stable)
- **Data Points**: Show actual weight values on hover
- **Goal Lines**: Optional goal weight line for reference

#### 3. Enhanced Data Management
- **Weight History API**: Enhanced API endpoints for retrieving daily weight data
- **Date-based Queries**: Efficient queries for specific date ranges
- **Data Aggregation**: Calculate daily averages, trends, and statistics
- **Caching Strategy**: Implement smart caching for frequently accessed data

### Technical Stack Integration
- **Frontend**: Next.js 14 with TypeScript
- **Charting Library**: Chart.js or Recharts for line chart visualization
- **Backend**: Firebase Firestore (existing)
- **API**: RESTful endpoints (enhancing existing)
- **UI**: Tailwind CSS with Neobrutalism design system (existing)
- **State Management**: React Query for data fetching and caching

## Data Models

### Enhanced Weight Entry Interface
```typescript
export interface WeightEntry {
  id: string;
  userId: string;
  weight: number; // in kg
  unit: 'kg' | 'lbs';
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // New fields for enhanced tracking
  dayOfWeek?: string; // Monday, Tuesday, etc.
  weekNumber?: number; // ISO week number
  month?: number; // 1-12
  year?: number;
}
```

### Daily Weight Summary
```typescript
export interface DailyWeightSummary {
  date: string; // YYYY-MM-DD format
  weight?: number; // null if no entry for that day
  unit: 'kg' | 'lbs';
  hasEntry: boolean;
  dayOfWeek: string;
  weekNumber: number;
  month: number;
  year: number;
}
```

### Weight Trend Data
```typescript
export interface WeightTrendData {
  period: '7d' | '14d' | '30d' | '90d';
  data: DailyWeightSummary[];
  statistics: {
    averageWeight: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    trendPercentage: number;
    highestWeight: number;
    lowestWeight: number;
    totalEntries: number;
  };
}
```

### Enhanced Weight Stats
```typescript
export interface WeightStats {
  currentWeight: number;
  startingWeight: number;
  goalWeight?: number;
  totalChange: number;
  weeklyChange: number;
  monthlyChange: number;
  streakDays: number;
  // New fields for enhanced tracking
  todayWeight?: number;
  yesterdayWeight?: number;
  weeklyTrend: WeightTrendData;
  monthlyTrend: WeightTrendData;
  lastEntryDate?: Date;
  averageWeeklyWeight: number;
  consistencyScore: number; // percentage of days with entries
}
```

## API Endpoints

### Enhanced Weight History API
```typescript
// Get weight entries for a specific date range
GET /api/weight/history?startDate=2024-01-01&endDate=2024-01-31&limit=100

// Get daily weight summary for a date range
GET /api/weight/daily-summary?startDate=2024-01-01&endDate=2024-01-31

// Get weight trend data for a specific period
GET /api/weight/trend?period=7d&startDate=2024-01-01

// Get today's weight entry
GET /api/weight/today

// Get weight entry for a specific date
GET /api/weight/date/2024-01-15

// Get enhanced weight statistics
GET /api/weight/stats/enhanced
```

### Request/Response Examples

#### Get Daily Weight Summary
```typescript
// Request
GET /api/weight/daily-summary?startDate=2024-01-01&endDate=2024-01-07

// Response
{
  "success": true,
  "data": {
    "period": "7d",
    "summary": [
      {
        "date": "2024-01-01",
        "weight": 75.2,
        "unit": "kg",
        "hasEntry": true,
        "dayOfWeek": "Monday",
        "weekNumber": 1,
        "month": 1,
        "year": 2024
      },
      {
        "date": "2024-01-02",
        "weight": null,
        "unit": "kg",
        "hasEntry": false,
        "dayOfWeek": "Tuesday",
        "weekNumber": 1,
        "month": 1,
        "year": 2024
      }
      // ... more days
    ]
  }
}
```

#### Get Weight Trend Data
```typescript
// Request
GET /api/weight/trend?period=7d

// Response
{
  "success": true,
  "data": {
    "period": "7d",
    "data": [...], // DailyWeightSummary array
    "statistics": {
      "averageWeight": 74.8,
      "trendDirection": "decreasing",
      "trendPercentage": -0.5,
      "highestWeight": 75.2,
      "lowestWeight": 74.3,
      "totalEntries": 5
    }
  }
}
```

## User Interface Components

### 1. Enhanced Weight Dashboard
- **Location**: `/dashboard/weight` (enhancing existing page)
- **Features**:
  - Today's weight display with yesterday comparison
  - Quick navigation between days
  - 7-day trend line chart
  - Enhanced statistics cards
  - Calendar view for weight entries

### 2. Daily Weight View Component
```typescript
interface DailyWeightViewProps {
  selectedDate: Date;
  weightEntry?: WeightEntry;
  onDateChange: (date: Date) => void;
  onLogWeight: (weight: number, unit: 'kg' | 'lbs', notes?: string) => void;
}
```

### 3. Weight Trend Chart Component
```typescript
interface WeightTrendChartProps {
  data: WeightTrendData;
  period: '7d' | '14d' | '30d' | '90d';
  onPeriodChange: (period: string) => void;
  goalWeight?: number;
  showGoalLine?: boolean;
}
```

### 4. Weight Calendar Component
```typescript
interface WeightCalendarProps {
  month: Date;
  weightEntries: WeightEntry[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}
```

## Implementation Phases

### Phase 1: Enhanced Data Layer (Week 1)
- [ ] Update WeightEntry interface with additional fields
- [ ] Create DailyWeightSummary and WeightTrendData interfaces
- [ ] Enhance MorningRoutineService with new methods
- [ ] Implement new API endpoints for daily summary and trends
- [ ] Add data aggregation and trend calculation logic

### Phase 2: Daily Weight Viewing (Week 2)
- [ ] Create DailyWeightView component
- [ ] Implement date navigation functionality
- [ ] Add today/yesterday comparison display
- [ ] Create weight entry form for specific dates
- [ ] Add missing day indicators

### Phase 3: Trend Visualization (Week 3)
- [ ] Integrate charting library (Chart.js or Recharts)
- [ ] Create WeightTrendChart component
- [ ] Implement 7-day line chart with interactive features
- [ ] Add period selection (7d, 14d, 30d)
- [ ] Implement trend analysis and statistics

### Phase 4: Enhanced Dashboard (Week 4)
- [ ] Update existing weight dashboard page
- [ ] Integrate new components
- [ ] Add calendar view for weight entries
- [ ] Enhance statistics cards with trend data
- [ ] Implement responsive design for mobile

### Phase 5: Advanced Features (Week 5)
- [ ] Add weight goal setting and tracking
- [ ] Implement data export functionality
- [ ] Add weight consistency scoring
- [ ] Create weight milestone celebrations
- [ ] Add sharing capabilities

## Technical Implementation Details

### Service Layer Enhancements
```typescript
// Enhanced MorningRoutineService methods
class MorningRoutineService {
  // Existing methods...
  
  // New methods for enhanced weight tracking
  static async getDailyWeightSummary(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<DailyWeightSummary[]>
  
  static async getWeightTrend(
    userId: string, 
    period: '7d' | '14d' | '30d' | '90d',
    startDate?: Date
  ): Promise<WeightTrendData>
  
  static async getWeightForDate(
    userId: string, 
    date: Date
  ): Promise<WeightEntry | null>
  
  static async getEnhancedWeightStats(
    userId: string
  ): Promise<WeightStats>
}
```

### Chart Configuration
```typescript
// Chart.js configuration for weight trend
const chartConfig = {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Weight (kg)',
      data: weights,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => `${context.parsed.y} kg`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
};
```

### Caching Strategy
```typescript
// React Query configuration for weight data
export const useWeightTrend = (period: string) => {
  return useQuery({
    queryKey: ['weight', 'trend', period],
    queryFn: () => fetchWeightTrend(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useDailyWeightSummary = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['weight', 'daily-summary', startDate, endDate],
    queryFn: () => fetchDailyWeightSummary(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};
```

## Testing Strategy

### Unit Tests
- [ ] Test data aggregation functions
- [ ] Test trend calculation algorithms
- [ ] Test API endpoint responses
- [ ] Test component rendering and interactions

### Integration Tests
- [ ] Test API integration with frontend components
- [ ] Test chart data flow and rendering
- [ ] Test date navigation functionality
- [ ] Test weight entry and retrieval flow

### E2E Tests
- [ ] Test complete weight logging workflow
- [ ] Test daily weight viewing functionality
- [ ] Test trend chart interactions
- [ ] Test responsive design on mobile devices

## Performance Considerations

### Data Optimization
- Implement pagination for large date ranges
- Use efficient date-based queries in Firestore
- Implement smart caching for frequently accessed data
- Optimize chart rendering for mobile devices

### Mobile Performance
- Lazy load chart components
- Implement virtual scrolling for long lists
- Optimize touch interactions for mobile
- Reduce bundle size for charting libraries

## Accessibility Requirements

### Chart Accessibility
- Provide alternative text descriptions for charts
- Implement keyboard navigation for chart interactions
- Ensure sufficient color contrast for chart elements
- Add screen reader support for chart data

### General Accessibility
- Maintain WCAG 2.1 AA compliance
- Ensure proper heading hierarchy
- Provide clear error messages and loading states
- Support high contrast mode

## Success Metrics

### User Engagement
- Daily active users on weight tracking feature
- Average session duration on weight pages
- Weight entry completion rate
- Chart interaction frequency

### Technical Performance
- API response times for weight data
- Chart rendering performance
- Mobile app performance metrics
- Error rates for weight tracking features

### User Satisfaction
- User feedback on new features
- Feature adoption rate
- User retention in weight tracking
- Support ticket reduction for weight-related issues

## Future Enhancements

### Advanced Analytics
- Weight prediction algorithms
- Pattern recognition for weight fluctuations
- Integration with fitness tracking apps
- Machine learning insights

### Social Features
- Weight loss challenges
- Community support groups
- Progress sharing with friends
- Achievement badges and rewards

### Health Integration
- Integration with health apps (Apple Health, Google Fit)
- BMI calculation and tracking
- Body composition tracking
- Medical professional data sharing 
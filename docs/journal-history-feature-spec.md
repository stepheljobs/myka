# Journal History & Calendar View Feature Specification

## Overview
A feature that allows users to browse, view, and read their past journal entries through a calendar interface and history view, enabling reflection on their personal growth journey.

## Core Features

### 1. Calendar View
- **Monthly Calendar**: Interactive calendar showing days with/without entries
- **Visual Indicators**: 
  - ✅ Green dot for days with completed entries
  - 📝 Gray dot for days with partial entries
  - Empty for days without entries
- **Navigation**: Previous/next month buttons
- **Quick Access**: Tap any day to view that day's entry

### 2. History List View
- **Chronological List**: Recent entries displayed in reverse chronological order
- **Entry Previews**: Show first few words of wins and commitments
- **Date Headers**: Group entries by month/week
- **Quick Actions**: Edit, view full entry, or delete options

### 3. Entry Detail View
- **Full Entry Display**: Complete wins and commitments for selected date
- **Read-Only Mode**: Clean, focused reading experience
- **Edit Option**: Ability to edit past entries (with confirmation)
- **Navigation**: Previous/next day buttons for easy browsing

### 4. Search & Filter
- **Date Range**: Filter by specific date ranges
- **Keyword Search**: Search within wins and commitments text
- **Quick Filters**: "This week", "This month", "Last 30 days"

## Technical Implementation

### Data Models

```typescript
export interface JournalHistoryEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  wins: string;
  commitments: string;
  createdAt: Date;
  updatedAt: Date;
  // For preview purposes
  winsPreview?: string;
  commitmentsPreview?: string;
}

export interface JournalHistoryFilters {
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  limit?: number;
}

export interface JournalHistoryStats {
  totalEntries: number;
  entriesThisMonth: number;
  entriesThisWeek: number;
  longestStreak: number;
  currentStreak: number;
  lastEntryDate?: string;
}
```

### API Endpoints

1. **GET /api/journal/history** - Get paginated journal history
   - Query params: `startDate`, `endDate`, `search`, `limit`, `offset`
2. **GET /api/journal/entry/[date]** - Get specific day's entry
3. **GET /api/journal/calendar/[year]/[month]** - Get calendar data for month
4. **PUT /api/journal/entry/[date]** - Update past entry
5. **DELETE /api/journal/entry/[date]** - Delete entry

### File Structure

```
src/
├── app/
│   ├── api/
│   │   └── journal/
│   │       ├── calendar/
│   │       │   └── [year]/
│   │       │       └── [month]/
│   │       │           └── route.ts
│   │       └── entry/
│   │           └── [date]/
│   │               └── route.ts
│   └── dashboard/
│       └── journal/
│           ├── history/
│           │   ├── page.tsx
│           │   └── components/
│           │       ├── CalendarView.tsx
│           │       ├── HistoryList.tsx
│           │       ├── EntryDetail.tsx
│           │       └── SearchFilters.tsx
│           └── [date]/
│               └── page.tsx
├── components/
│   └── ui/
│       ├── Calendar.tsx
│       ├── EntryCard.tsx
│       └── SearchBar.tsx
├── hooks/
│   └── useJournalHistory.ts
└── lib/
    └── journal-history-service.ts
```

### UI Components

1. **Calendar Component**
   - Monthly grid layout
   - Day indicators for entry status
   - Navigation controls
   - Responsive design

2. **History List Component**
   - Virtualized list for performance
   - Entry preview cards
   - Infinite scroll or pagination
   - Group by date headers

3. **Entry Detail Component**
   - Full entry display
   - Edit/delete actions
   - Navigation between entries
   - Share functionality (optional)

4. **Search & Filter Component**
   - Date range picker
   - Search input
   - Quick filter buttons
   - Clear filters option

## User Experience

### Navigation Flow
1. **From Journal Page**: "View History" button
2. **From Dashboard**: Journal card shows "View History" option
3. **Calendar View**: Default view showing current month
4. **List View**: Alternative view for browsing entries
5. **Entry Detail**: Tap any entry to view full content

### Calendar Interface
- **Current Month Focus**: Highlight current month by default
- **Entry Indicators**: 
  - Green circle: Complete entry
  - Gray circle: Partial entry
  - No indicator: No entry
- **Today Highlight**: Special styling for today's date
- **Weekend Styling**: Subtle visual distinction for weekends

### History List Interface
- **Chronological Order**: Most recent entries first
- **Entry Previews**: First 50 characters of wins/commitments
- **Date Grouping**: "This Week", "Last Week", "This Month", etc.
- **Quick Actions**: View, edit, delete buttons on each entry

### Search Experience
- **Real-time Search**: Search as you type
- **Highlighted Results**: Bold matching text in results
- **Search History**: Remember recent searches
- **Advanced Filters**: Date range, entry type filters

## Features by Phase

### Phase 1: Basic History View
- [x] Calendar component with entry indicators
- [x] Basic history list view
- [x] Entry detail page
- [x] Navigation between views
- [x] API endpoints for fetching history

### Phase 2: Enhanced Navigation
- [ ] Previous/next day navigation
- [ ] Month navigation in calendar
- [ ] Quick jump to today
- [ ] Breadcrumb navigation
- [ ] Back button handling

### Phase 3: Search & Filter
- [ ] Date range picker
- [ ] Text search functionality
- [ ] Quick filter buttons
- [ ] Search results highlighting
- [ ] Filter state management

### Phase 4: Advanced Features
- [ ] Edit past entries
- [ ] Delete entries with confirmation
- [ ] Export functionality
- [ ] Share entries (optional)
- [ ] Analytics and insights

## Technical Considerations

### Performance
- **Pagination**: Load entries in chunks (20-50 per page)
- **Virtualization**: Use virtual scrolling for large lists
- **Caching**: Cache calendar data and recent entries
- **Lazy Loading**: Load entry details on demand

### Data Management
- **Offline Support**: Cache history for offline viewing
- **Sync Strategy**: Handle conflicts when editing past entries
- **Data Validation**: Ensure date formats and entry integrity
- **Backup**: Consider export/backup functionality

### Security
- **Access Control**: Users can only view their own entries
- **Edit Permissions**: Confirmation for editing past entries
- **Delete Protection**: Confirmation and potential recovery
- **Data Privacy**: Ensure sensitive journal content is protected

## Success Metrics
- **Usage**: Number of users viewing history
- **Engagement**: Time spent browsing past entries
- **Retention**: Users returning to view history
- **Feature Adoption**: Percentage using search/filter features

## Future Enhancements
- **Mood Tracking**: Add mood indicators to entries
- **Tags/Categories**: Allow users to tag entries
- **Journal Prompts**: Show what prompts were used
- **Progress Tracking**: Visual progress indicators
- **Social Features**: Share insights (with privacy controls)
- **AI Insights**: Generate patterns and insights from entries
- **Export Options**: PDF, CSV, or other formats
- **Print Functionality**: Print-friendly entry views 
# Daily Journaling Feature Specification

## Overview
A simple daily journaling feature that encourages users to reflect on their wins and commitments for personal growth and motivation.

## Core Features

### 1. Daily Journal Entry
- **Wins Section**: "🙌 Write 3-5 wins you've had today. It can be fitness-related or outside fitness, it's up to you!"
- **Commitments Section**: "🤔 Write 2-3 things that you commit to doing to make tomorrow better than today."
- **Date-based entries**: One entry per day
- **Simple text input**: Free-form text areas for both sections

### 2. User Interface
- **Dashboard Integration**: New journaling card on main dashboard
- **Dedicated Journal Page**: Full-page journaling experience
- **Date Navigation**: View and edit previous entries
- **Progress Indicators**: Streak tracking and completion status

### 3. Data Management
- **Firestore Integration**: Store entries in `journal_entries` collection
- **Offline Support**: Work offline with sync when connection restored
- **Real-time Updates**: Live updates across devices

## Technical Implementation

### Data Models

```typescript
export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  wins: string;
  commitments: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalStats {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  hasEntry: boolean;
  streakDays: number;
  totalEntries: number;
  lastEntryDate?: Date;
}
```

### API Endpoints

1. **GET /api/journal/today** - Get today's entry
2. **GET /api/journal/date/[date]** - Get entry for specific date
3. **POST /api/journal/entry** - Create/update today's entry
4. **GET /api/journal/stats/[date]** - Get journaling statistics
5. **GET /api/journal/history** - Get recent entries

### File Structure

```
src/
├── app/
│   ├── api/
│   │   └── journal/
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
│   │       └── history/
│   │           └── route.ts
│   └── dashboard/
│       └── journal/
│           ├── page.tsx
│           └── components/
│               ├── JournalEntry.tsx
│               ├── JournalStats.tsx
│               └── DateNavigator.tsx
├── components/
│   └── ui/
│       └── JournalCard.tsx
├── hooks/
│   └── useJournal.ts
├── lib/
│   └── journal-service.ts
└── types/
    └── index.ts (add journal types)
```

### UI Components

1. **JournalCard** (Dashboard)
   - Shows today's entry status
   - Quick access to journal
   - Streak indicator

2. **JournalEntry** (Main Component)
   - Two text areas for wins and commitments
   - Save/update functionality
   - Character count indicators

3. **JournalStats**
   - Streak counter
   - Total entries
   - Completion rate

4. **DateNavigator**
   - Calendar-style navigation
   - Previous/next day buttons
   - Entry status indicators

## User Experience

### Dashboard Integration
- Add journaling card to main dashboard
- Show completion status for today
- Display current streak
- Quick "Add Entry" button

### Journal Page
- Clean, focused interface
- Large text areas for comfortable writing
- Auto-save functionality
- Date picker for viewing past entries
- Statistics sidebar

### Mobile-First Design
- Touch-friendly interface
- Responsive text areas
- Easy navigation between dates
- Offline capability

## Features by Phase

### Phase 1: Core Functionality
- [ ] Data models and types
- [ ] Firestore service methods
- [ ] API endpoints
- [ ] Basic journal page
- [ ] Create/update entries

### Phase 2: Dashboard Integration
- [ ] Journal card component
- [ ] Dashboard integration
- [ ] Quick entry functionality
- [ ] Basic statistics

### Phase 3: Enhanced Features
- [ ] Date navigation
- [ ] Entry history
- [ ] Streak tracking
- [ ] Statistics and insights

### Phase 4: Polish
- [ ] Auto-save
- [ ] Offline support
- [ ] Notifications/reminders
- [ ] Export functionality

## Success Metrics
- Daily active users for journaling
- Entry completion rate
- User retention with journaling
- Streak maintenance rates

## Future Enhancements
- Mood tracking
- Journal prompts/templates
- Photo attachments
- Social sharing (optional)
- AI-powered insights
- Journal analytics 
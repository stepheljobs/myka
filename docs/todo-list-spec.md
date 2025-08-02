# Todo List Feature Specification

## Overview
Implement a mobile-style bottom navigation with a comprehensive todo list feature as the second tab. The todo list will allow users to manage daily priorities, view historical todos, and schedule future tasks.

## Feature Requirements

### 1. Bottom Navigation
- **Position**: Fixed bottom navigation bar
- **Tabs**: 
  - Tab 1: Dashboard (existing)
  - Tab 2: Todo List (new)
  - Tab 3: Settings (existing)
- **Design**: Neobrutalist style consistent with existing UI
- **Icons**: Dashboard (🏠), Todo List (📝), Settings (⚙️)
- **Active State**: Bold border and background color change

### 2. Todo List Core Features

#### 2.1 Daily Todo Management
- **Top 3 Priorities**: Display the 3 most important todos for today
- **Quick Actions**: Check/uncheck todos with single tap
- **Priority Indicators**: Visual indicators for priority levels (High/Medium/Low)
- **Progress Tracking**: Show completion percentage for the day

#### 2.2 Todo Item Structure
```typescript
interface TodoItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}
```

#### 2.3 Date Navigation
- **Today View**: Current day's todos (default)
- **Yesterday View**: Previous day's completed/incomplete todos
- **Future View**: Scheduled todos for upcoming days
- **Calendar Integration**: Date picker for historical navigation
- **Quick Date Switcher**: Today/Yesterday/Tomorrow buttons

### 3. User Interface Components

#### 3.1 Todo List Page (`/dashboard/todos`)
- **Header**: Date display with navigation arrows
- **Quick Stats**: Today's completion rate, total todos
- **Priority Section**: Top 3 priorities prominently displayed
- **All Todos**: Scrollable list of all today's todos
- **Add Todo**: Floating action button or inline add form

#### 3.2 Todo Item Component
- **Checkbox**: Large, easy-to-tap checkbox
- **Title**: Bold, clear text
- **Priority Badge**: Color-coded priority indicator
- **Due Time**: Optional time display
- **Actions**: Edit, delete, duplicate options

#### 3.3 Add/Edit Todo Modal
- **Title Input**: Required field
- **Description**: Optional textarea
- **Priority Selector**: Radio buttons or dropdown
- **Due Date**: Date picker with time option
- **Tags**: Optional tag input
- **Recurring Options**: Toggle for recurring todos

### 4. Data Management

#### 4.1 Firestore Collections
```typescript
// Collection: todos
interface TodoDocument {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags: string[];
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    lastGenerated?: Timestamp;
  };
}

// Collection: todo_stats (for analytics)
interface TodoStats {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  totalTodos: number;
  completedTodos: number;
  completionRate: number;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}
```

#### 4.2 API Endpoints
- `GET /api/todos/today` - Get today's todos
- `GET /api/todos/[date]` - Get todos for specific date
- `POST /api/todos` - Create new todo
- `PUT /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo
- `PUT /api/todos/[id]/toggle` - Toggle completion status
- `GET /api/todos/stats/[date]` - Get todo statistics

### 5. Technical Implementation

#### 5.1 New Files to Create
```
src/
├── app/
│   └── dashboard/
│       └── todos/
│           ├── page.tsx
│           ├── [date]/
│           │   └── page.tsx
│           └── components/
│               ├── TodoList.tsx
│               ├── TodoItem.tsx
│               ├── AddTodoModal.tsx
│               ├── TodoStats.tsx
│               └── DateNavigator.tsx
├── components/
│   └── BottomNavigation.tsx
├── hooks/
│   └── useTodos.ts
├── lib/
│   └── todo-service.ts
└── types/
    └── index.ts (extend with todo types)
```

#### 5.2 Service Layer
```typescript
// src/lib/todo-service.ts
class TodoService {
  async getTodosForDate(userId: string, date: Date): Promise<TodoItem[]>
  async createTodo(todo: Omit<TodoItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<TodoItem>
  async updateTodo(id: string, updates: Partial<TodoItem>): Promise<TodoItem>
  async deleteTodo(id: string): Promise<void>
  async toggleTodo(id: string): Promise<TodoItem>
  async getTodoStats(userId: string, date: Date): Promise<TodoStats>
  async getTopPriorities(userId: string, date: Date): Promise<TodoItem[]>
}
```

#### 5.3 Custom Hook
```typescript
// src/hooks/useTodos.ts
export function useTodos(date: Date) {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const addTodo = async (todo: Omit<TodoItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {}
  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {}
  const deleteTodo = async (id: string) => {}
  const toggleTodo = async (id: string) => {}
  
  return { todos, loading, error, addTodo, updateTodo, deleteTodo, toggleTodo }
}
```

### 6. UI/UX Design Guidelines

#### 6.1 Bottom Navigation
- **Height**: 60px on mobile, 70px on tablet
- **Background**: `bg-brutal-white` with `border-t-brutal border-brutal-black`
- **Active Tab**: `bg-brutal-blue` with `text-brutal-white`
- **Inactive Tab**: `text-brutal-gray`
- **Icons**: 24px size with 4px spacing from text

#### 6.2 Todo List Design
- **Priority Colors**: 
  - High: `bg-brutal-red` with `text-brutal-white`
  - Medium: `bg-brutal-orange` with `text-brutal-white`
  - Low: `bg-brutal-green` with `text-brutal-white`
- **Completed Items**: Strikethrough text with `text-brutal-gray`
- **Checkbox**: Large 24px checkbox with brutalist border
- **Card Layout**: Each todo in a `Card` component with `shadow="md"`

#### 6.3 Responsive Design
- **Mobile**: Single column layout, bottom navigation
- **Tablet**: Two-column layout for todo list and details
- **Desktop**: Three-column layout with calendar sidebar

### 7. Task Breakdown

#### Phase 1: Foundation (Week 1)
- [ ] Create todo types and interfaces
- [ ] Set up Firestore collections and rules
- [ ] Implement TodoService with basic CRUD operations
- [ ] Create useTodos custom hook
- [ ] Set up API routes for todo operations

#### Phase 2: Core UI (Week 2)
- [ ] Create BottomNavigation component
- [ ] Implement TodoList page layout
- [ ] Create TodoItem component
- [ ] Build AddTodoModal component
- [ ] Add date navigation functionality

#### Phase 3: Advanced Features (Week 3)
- [ ] Implement priority system and top 3 priorities
- [ ] Add recurring todo functionality
- [ ] Create todo statistics and analytics
- [ ] Build calendar integration
- [ ] Add search and filtering capabilities

#### Phase 4: Polish & Testing (Week 4)
- [ ] Add animations and transitions
- [ ] Implement offline support
- [ ] Add unit tests for components and services
- [ ] Performance optimization
- [ ] User testing and feedback integration

### 8. Success Metrics
- **User Engagement**: Daily active users on todo feature
- **Completion Rate**: Percentage of todos completed daily
- **User Retention**: Users returning to use todo feature
- **Performance**: Page load time under 2 seconds
- **Accessibility**: WCAG 2.1 AA compliance

### 9. Future Enhancements
- **Smart Suggestions**: AI-powered todo suggestions
- **Collaboration**: Shared todo lists with family/team
- **Integration**: Calendar app integration
- **Analytics**: Detailed productivity insights
- **Gamification**: Streaks, achievements, and rewards

### 10. Technical Considerations
- **Offline Support**: Todos should work without internet
- **Data Sync**: Conflict resolution for offline changes
- **Performance**: Virtual scrolling for large todo lists
- **Accessibility**: Screen reader support and keyboard navigation
- **Security**: User data isolation and validation

## Implementation Priority
1. **High Priority**: Bottom navigation, basic todo CRUD, today's view
2. **Medium Priority**: Date navigation, priority system, statistics
3. **Low Priority**: Recurring todos, advanced analytics, integrations 
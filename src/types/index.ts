// PWA Installation Types
export interface InstallationState {
  canInstall: boolean;
  isInstalled: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  promptShown: boolean;
  installationDate?: Date;
}

export interface InstallationManager {
  canInstall: boolean;
  isInstalled: boolean;
  showInstallPrompt(): Promise<void>;
  handleInstallEvent(): void;
  trackInstallationState(): void;
}

// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  profileImage?: string;
  emailVerified: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt: Date;
  authProvider: 'email' | 'google' | 'anonymous';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  scheduledNotifications: {
    enabled: boolean;
    times: {
      weightTracking: string; // "06:00"
      priorityReview: string; // "06:30"
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

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// App Data Types
export interface AppData {
  id: string;
  userId: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

// Component Props Types
export interface NeobrutalistComponent {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'brutal';
  border?: boolean;
  rounded?: boolean;
}

// Fitness Feature Types
export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  shapeType: 'circle' | 'square' | 'triangle' | 'rectangle';
  shapeColor: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';
}

// Neobrutalism Theme Types
export interface NeobrutalistTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  shadows: {
    brutal: string;
    offset: string;
  };
}

// Morning Routine Types
export interface MorningRoutineConfig {
  id: string;
  userId: string;
  wakeUpTime: string; // HH:MM format
  enabled: boolean;
  tasks: MorningTask[];
  notificationSettings: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface MorningTask {
  id: string;
  type: 'weight' | 'water' | 'custom';
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
  customGoal?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
}

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
  lastEntryDate?: Date;
  averageWeeklyWeight: number;
  consistencyScore: number; // percentage of days with entries
}

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

export interface WaterEntry {
  id: string;
  userId: string;
  amount: number; // in ml
  date: Date;
  time: Date;
  createdAt: Date;
}

export interface WaterStats {
  dailyGoal: number; // in ml
  currentIntake: number;
  remainingIntake: number;
  percentageComplete: number;
  streakDays: number;
  averageDailyIntake: number;
}

export interface DailyProgress {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completedTasks: string[]; // task IDs
  weightLogged: boolean;
  waterIntake: number;
  waterGoal: number;
  streakCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Todo List Types (SIMPLE)
export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoDocument {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoStats {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  totalTodos: number;
  completedTodos: number;
  completionRate: number;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

// Bottom Navigation Types
export interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive: boolean;
}

// Journaling Types
export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  wins: string;
  commitments: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface CreateJournalEntryRequest {
  wins: string;
  commitments: string;
}

export interface UpdateJournalEntryRequest {
  wins?: string;
  commitments?: string;
}

// Journal History Types
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
  offset?: number;
}

export interface JournalHistoryStats {
  totalEntries: number;
  entriesThisMonth: number;
  entriesThisWeek: number;
  longestStreak: number;
  currentStreak: number;
  lastEntryDate?: string;
}

// Dailies Types
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

export interface CreateDailyEntryRequest {
  sleepQuality: number;
  weight?: number;
  workoutCompleted: boolean;
  steps: number;
  stressLevel: number;
  fatigueLevel: number;
  hungerLevel: number;
  goalReviewCompleted: boolean;
  tomorrowPlanningCompleted: boolean;
  notes?: string;
}

export interface UpdateDailyEntryRequest {
  sleepQuality?: number;
  weight?: number;
  workoutCompleted?: boolean;
  steps?: number;
  stressLevel?: number;
  fatigueLevel?: number;
  hungerLevel?: number;
  goalReviewCompleted?: boolean;
  tomorrowPlanningCompleted?: boolean;
  notes?: string;
}

// Scheduled Notifications Types
export type NotificationType = 
  | 'weight-tracking'
  | 'priority-review'
  | 'water-reminder'
  | 'evening-journal'
  | 'custom';

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface ScheduledNotification {
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

export interface ScheduledNotificationDocument {
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

export interface NotificationLog {
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



// Priority Management Types
export interface Priority {
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
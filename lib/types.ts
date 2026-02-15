
export enum Category {
  BODY = 'Body',
  MIND = 'Mind',
  DEEN = 'Deen',
}

export interface Task {
  id: string;
  label: string;
  category: Category;
  completed: boolean;
}

export interface DayData {
  date: string;
  tasks: Task[];
  deepWorkMinutes: number;
  waterIntake: number;
}

export interface IdentityProfile {
  vision: string;
  coreValues: string[];
  nonNegotiables: string[];
  antiIdentity: string[];
  level: number;
  xp: number;
}

export interface AppState {
  history: Record<string, DayData>;
  identity: IdentityProfile;
  activeTab: 'dashboard' | 'focus' | 'identity';
}

export const INITIAL_TASKS: Task[] = [
  { id: 'walk', label: '30 min Walk', category: Category.BODY, completed: false },
  { id: 'workout', label: '20 min Workout', category: Category.BODY, completed: false },
  { id: 'sleep', label: 'Sleep by 11:00 PM', category: Category.BODY, completed: false },
  { id: 'learning', label: '3h Deep Learning', category: Category.MIND, completed: false },
  { id: 'no_scroll', label: 'No Mindless Scrolling', category: Category.MIND, completed: false },
  { id: 'prayers', label: '5 Daily Prayers', category: Category.DEEN, completed: false },
  { id: 'zikr', label: 'Morning/Evening Zikr', category: Category.DEEN, completed: false },
];

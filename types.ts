
export enum Category {
  BODY = 'Body',
  MIND = 'Mind',
  DEEN = 'Deen',
  CAREER = 'Career',
  SOCIAL = 'Social',
}

export interface Task {
  id: string;
  label: string;
  category: Category;
  completed: boolean;
  type: 'boolean' | 'numeric' | 'scale';
  value?: number;
  target?: number;
}

export interface DayData {
  date: string;
  tasks: Task[];
  deepWorkMinutes: number;
  waterIntake: number; // liters
  sleepTime?: string;
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
  history: Record<string, DayData>; // YYYY-MM-DD
  identity: IdentityProfile;
  activeTab: string;
}

export const INITIAL_TASKS: Task[] = [
  // Body
  { id: 'walk', label: '30 min Walk', category: Category.BODY, completed: false, type: 'boolean' },
  { id: 'workout', label: '20 min Workout', category: Category.BODY, completed: false, type: 'boolean' },
  { id: 'sun', label: 'Sunlight Exposure', category: Category.BODY, completed: false, type: 'boolean' },
  { id: 'protein', label: 'Protein-Focused Meal', category: Category.BODY, completed: false, type: 'boolean' },
  { id: 'sleep', label: 'Sleep by 11:00 PM', category: Category.BODY, completed: false, type: 'boolean' },
  // Mind
  { id: 'learning', label: '3h Deep Learning', category: Category.MIND, completed: false, type: 'boolean' },
  { id: 'brand', label: 'Content Posting', category: Category.MIND, completed: false, type: 'boolean' },
  { id: 'uncomfortable', label: '1 Uncomfortable Thing', category: Category.MIND, completed: false, type: 'boolean' },
  { id: 'no_scroll', label: 'No Mindless Scrolling', category: Category.MIND, completed: false, type: 'boolean' },
  // Deen
  { id: 'prayers', label: '5 Daily Prayers', category: Category.DEEN, completed: false, type: 'boolean' },
  { id: 'khushu', label: 'Khushu (1-10)', category: Category.DEEN, completed: false, type: 'scale', value: 5, target: 10 },
  { id: 'zikr', label: 'Zikr', category: Category.DEEN, completed: false, type: 'boolean' },
  { id: 'tilawat', label: 'Tilawat', category: Category.DEEN, completed: false, type: 'boolean' },
];

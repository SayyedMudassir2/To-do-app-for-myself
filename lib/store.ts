
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, DayData, INITIAL_TASKS } from './types';

const STORAGE_KEY = 'mastery_os_v3';

const getTodayString = () => new Date().toISOString().split('T')[0];

export function useAppState() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, setState] = useState<AppState>({
    history: {},
    activeTab: 'dashboard',
    identity: {
      vision: "Architect of Excellence",
      coreValues: ["Focus", "Integrity"],
      nonNegotiables: ["Early rising"],
      antiIdentity: ["Distraction"],
      level: 1,
      xp: 0
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to load state");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const today = getTodayString();

  const currentDayData = useMemo((): DayData => {
    if (state.history[today]) return state.history[today];
    return {
      date: today,
      tasks: INITIAL_TASKS.map(t => ({ ...t })),
      deepWorkMinutes: 0,
      waterIntake: 0
    };
  }, [state.history, today]);

  const streak = useMemo(() => {
    let count = 0;
    let curr = new Date();
    while (true) {
      const dStr = curr.toISOString().split('T')[0];
      const day = state.history[dStr];
      const completed = day?.tasks.some(t => t.completed);
      if (completed) {
        count++;
        curr.setDate(curr.getDate() - 1);
      } else if (dStr === today) {
        curr.setDate(curr.getDate() - 1);
        continue;
      } else break;
    }
    return count;
  }, [state.history, today]);

  const updateToday = useCallback((updater: (prev: DayData) => DayData) => {
    const updated = updater(currentDayData);
    const completedDiff = updated.tasks.filter(t => t.completed).length - currentDayData.tasks.filter(t => t.completed).length;
    
    setState(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        xp: Math.max(0, prev.identity.xp + (completedDiff * 10)),
        level: Math.floor(Math.max(0, prev.identity.xp + (completedDiff * 10)) / 500) + 1
      },
      history: { ...prev.history, [today]: updated }
    }));
  }, [currentDayData, today]);

  const setTab = (activeTab: AppState['activeTab']) => setState(p => ({ ...p, activeTab }));
  
  const updateIdentity = (identity: Partial<AppState['identity']>) => {
    setState(prev => ({ ...prev, identity: { ...prev.identity, ...identity } }));
  };

  return { state, isLoaded, updateToday, currentDayData, setTab, updateIdentity, streak, today };
}

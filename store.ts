
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, DayData, INITIAL_TASKS } from './types';

const STORAGE_KEY = 'level_2026_os_state_v2';

const getTodayString = () => new Date().toISOString().split('T')[0];

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    return {
      history: {},
      activeTab: 'dashboard',
      identity: {
        vision: "The Man I Am Becoming in 2026",
        coreValues: ["Discipline", "Integrity", "Excellence"],
        nonNegotiables: ["Never miss a prayer", "Early wake up", "Consistency"],
        antiIdentity: ["Complacency", "Escapism", "Arrogance"],
        level: 1,
        xp: 0
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getDayData = useCallback((date: string): DayData => {
    if (state.history[date]) return state.history[date];
    return {
      date,
      tasks: [...INITIAL_TASKS.map(t => ({ ...t }))],
      deepWorkMinutes: 0,
      waterIntake: 0
    };
  }, [state.history]);

  const streak = useMemo(() => {
    const history = state.history;
    const dates = Object.keys(history).sort().reverse();
    if (dates.length === 0) return 0;

    let count = 0;
    let curr = new Date();
    const todayStr = getTodayString();

    // Loop backwards from today
    while (true) {
      const dStr = curr.toISOString().split('T')[0];
      const day = history[dStr];
      const hasCompletedSomething = day && day.tasks.some(t => t.completed);

      if (hasCompletedSomething) {
        count++;
        curr.setDate(curr.getDate() - 1);
      } else {
        // If it's today and not yet done, don't break the streak yet, check yesterday
        if (dStr === todayStr) {
          curr.setDate(curr.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return count;
  }, [state.history]);

  const updateToday = useCallback((updater: (prev: DayData) => DayData) => {
    const today = getTodayString();
    const currentDay = getDayData(today);
    const updatedDay = updater(currentDay);
    
    // XP is strictly derived from current day performance
    const completedCount = updatedDay.tasks.filter(t => t.completed).length;
    const prevCompleted = currentDay.tasks.filter(t => t.completed).length;
    const xpGain = (completedCount - prevCompleted) * 10;

    setState(prev => {
      const newXp = prev.identity.xp + xpGain;
      const newLevel = Math.floor(newXp / 500) + 1;
      
      return {
        ...prev,
        identity: {
          ...prev.identity,
          xp: Math.max(0, newXp),
          level: newLevel
        },
        history: {
          ...prev.history,
          [today]: updatedDay
        }
      };
    });
  }, [getDayData]);

  const setTab = (tab: string) => setState(prev => ({ ...prev, activeTab: tab }));

  const updateIdentity = (identity: Partial<AppState['identity']>) => {
    setState(prev => ({ ...prev, identity: { ...prev.identity, ...identity } }));
  };

  return { state, updateToday, getDayData, setTab, updateIdentity, today: getTodayString(), streak };
}

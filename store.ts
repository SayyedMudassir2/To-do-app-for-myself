
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, DayData, INITIAL_TASKS, Task } from './types';

// Add missing types for logging
export interface LogEntry {
  timestamp: string;
  date: string;
  taskName: string;
  category: string;
  status: 'Completed' | 'Uncompleted';
  xpGain: number;
}

// Extend AppState to include eventLog
export interface ExtendedAppState extends AppState {
  eventLog: LogEntry[];
}

const STORAGE_KEY = 'level_2026_os_state_v3';

const getTodayString = () => new Date().toISOString().split('T')[0];

export function useAppState() {
  const [state, setState] = useState<ExtendedAppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, eventLog: parsed.eventLog || [] };
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    return {
      history: {},
      eventLog: [],
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

    while (true) {
      const dStr = curr.toISOString().split('T')[0];
      const day = history[dStr];
      const hasCompletedSomething = day && day.tasks.some(t => t.completed);

      if (hasCompletedSomething) {
        count++;
        curr.setDate(curr.getDate() - 1);
      } else {
        if (dStr === todayStr) {
          curr.setDate(curr.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return count;
  }, [state.history]);

  const updateToday = useCallback((updater: (prev: DayData) => DayData, changedTask?: Task) => {
    const today = getTodayString();
    const currentDay = getDayData(today);
    const updatedDay = updater(currentDay);
    
    const completedCount = updatedDay.tasks.filter(t => t.completed).length;
    const prevCompleted = currentDay.tasks.filter(t => t.completed).length;
    const xpGain = (completedCount - prevCompleted) * 10;

    let newEventLog = [...state.eventLog];
    if (changedTask) {
      const isCompleting = !changedTask.completed;
      newEventLog.push({
        timestamp: new Date().toLocaleTimeString(),
        date: today,
        taskName: changedTask.label,
        category: changedTask.category,
        status: isCompleting ? 'Completed' : 'Uncompleted',
        xpGain: isCompleting ? 10 : -10
      });
    }

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
        },
        eventLog: newEventLog
      };
    });
  }, [getDayData, state.eventLog]);

  const exportToCSV = useCallback(() => {
    if (state.eventLog.length === 0) {
      alert("No activity recorded yet. Check some boxes first!");
      return;
    }

    const headers = ["Date", "Time", "Task Name", "Category", "Status", "XP Gain"];
    const rows = state.eventLog.map(entry => [
      entry.date,
      entry.timestamp,
      `"${entry.taskName.replace(/"/g, '""')}"`,
      entry.category,
      entry.status,
      entry.xpGain
    ]);

    const csvString = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mastery_os_log_${getTodayString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.eventLog]);

  const setTab = (tab: string) => setState(prev => ({ ...prev, activeTab: tab }));

  const updateIdentity = (identity: Partial<AppState['identity']>) => {
    setState(prev => ({ ...prev, identity: { ...prev.identity, ...identity } }));
  };

  return { state, updateToday, getDayData, setTab, updateIdentity, today: getTodayString(), streak, exportToCSV };
}

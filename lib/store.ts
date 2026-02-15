
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, DayData, INITIAL_TASKS, LogEntry, Task } from './types';

const STORAGE_KEY = 'mastery_os_v4';

const getTodayString = () => new Date().toISOString().split('T')[0];

export function useAppState() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, setState] = useState<AppState>({
    history: {},
    eventLog: [],
    activeTab: 'dashboard',
    identity: {
      vision: "Architect of Excellence",
      coreValues: ["Focus", "Integrity", "Discipline"],
      nonNegotiables: ["Early rising", "Deep work", "No scrolling"],
      antiIdentity: ["Complacency", "Escapism"],
      level: 1,
      xp: 0
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed, eventLog: parsed.eventLog || [] }));
      } catch (e) {
        console.error("Failed to load state", e);
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

  const updateToday = useCallback((updater: (prev: DayData) => DayData, changedTask?: Task) => {
    const updated = updater(currentDayData);
    const completedDiff = updated.tasks.filter(t => t.completed).length - currentDayData.tasks.filter(t => t.completed).length;
    
    let newEventLog = [...state.eventLog];
    
    if (changedTask) {
      const isCompleting = !changedTask.completed;
      const newLogEntry: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        date: today,
        taskName: changedTask.label,
        category: changedTask.category,
        status: isCompleting ? 'Completed' : 'Uncompleted',
        xpGain: isCompleting ? 10 : -10
      };
      newEventLog.push(newLogEntry);
    }

    setState(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        xp: Math.max(0, prev.identity.xp + (completedDiff * 10)),
        level: Math.floor(Math.max(0, prev.identity.xp + (completedDiff * 10)) / 500) + 1
      },
      history: { ...prev.history, [today]: updated },
      eventLog: newEventLog
    }));
  }, [currentDayData, today, state.eventLog]);

  const exportToCSV = useCallback(() => {
    if (state.eventLog.length === 0) {
      alert("No activity recorded yet. Complete a task to generate logs.");
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
    link.setAttribute("download", `mastery_log_${today}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.eventLog, today]);

  const setTab = (activeTab: AppState['activeTab']) => setState(p => ({ ...p, activeTab }));
  
  const updateIdentity = (identity: Partial<AppState['identity']>) => {
    setState(prev => ({ ...prev, identity: { ...prev.identity, ...identity } }));
  };

  return { state, isLoaded, updateToday, currentDayData, setTab, updateIdentity, streak, today, exportToCSV };
}

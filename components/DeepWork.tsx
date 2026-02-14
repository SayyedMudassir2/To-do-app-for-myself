
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { DayData } from '../types';

interface DeepWorkProps {
  onUpdate: (updater: (prev: DayData) => DayData) => void;
}

export const DeepWork: React.FC<DeepWorkProps> = ({ onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setSessionsCompleted(prev => prev + 1);
    onUpdate(prev => ({ ...prev, deepWorkMinutes: prev.deepWorkMinutes + 25 }));
    setTimeLeft(25 * 60);
    // Notification for browser
    if (Notification.permission === 'granted') {
      new Notification("Focus Session Complete", { body: "Well done. Take a short break." });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest">
          <Target size={14} />
          Focus Engine
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Enter Deep Work</h2>
        <p className="text-zinc-500">25-minute sprints of absolute concentration.</p>
      </div>

      <div className="p-12 md:p-24 rounded-[40px] glass border-emerald-500/20 emerald-glow relative flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_100%)] pointer-events-none"></div>
        
        <div className="relative z-10 text-center">
           <div className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter tabular-nums mb-8">
             {formatTime(timeLeft)}
           </div>

           <div className="flex items-center justify-center gap-6">
             <button 
               onClick={toggleTimer}
               className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                 isActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-emerald-500 text-black hover:scale-105 shadow-xl'
               }`}
             >
               {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
             </button>
             <button 
               onClick={resetTimer}
               className="w-16 h-16 rounded-full glass border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-all"
             >
               <RotateCcw size={24} />
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Sprints Completed Today</p>
          <p className="text-3xl font-black">{sessionsCompleted}</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-950 border border-emerald-500/20 text-center">
           <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Real XP Gained</p>
           <p className="text-3xl font-black text-emerald-500">+{sessionsCompleted * 25}</p>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Target, Award } from 'lucide-react';
import { DayData } from '@/lib/types';

interface DeepWorkProps {
  onUpdate: (updater: (prev: DayData) => DayData) => void;
}

export const DeepWorkView: React.FC<DeepWorkProps> = ({ onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      finishSession();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const finishSession = () => {
    setIsActive(false);
    setSessions(s => s + 1);
    onUpdate(prev => ({ ...prev, deepWorkMinutes: prev.deepWorkMinutes + 25 }));
    setTimeLeft(25 * 60);
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Focus Session Complete", { body: "Take a 5-minute breather." });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center py-10 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
          <Target size={14} /> Focus Engine Active
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Pure Concentration</h2>
      </div>

      <div className="w-full aspect-square md:aspect-video rounded-[3rem] border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_100%)]"></div>
        
        <div className="text-[100px] md:text-[180px] font-black tracking-tighter tabular-nums leading-none select-none">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-6 mt-10">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-emerald-500 text-black hover:scale-110 shadow-emerald-500/20 shadow-xl'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
            className="w-16 h-16 rounded-full glass-card flex items-center justify-center hover:bg-zinc-900 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="p-6 rounded-2xl border border-zinc-800 text-center space-y-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase">Sprints Today</p>
          <p className="text-3xl font-black">{sessions}</p>
        </div>
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-2">
          <p className="text-[10px] font-black text-emerald-500 uppercase">XP Reward Potential</p>
          <div className="flex items-center justify-center gap-2">
            <Award className="text-emerald-500" size={20} />
            <p className="text-3xl font-black text-emerald-500">+{sessions * 25}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

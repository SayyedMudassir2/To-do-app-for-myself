
import React from 'react';
import { CheckCircle2, Droplets, Clock, Target, Plus, Minus } from 'lucide-react';
import { DayData, Task, Category } from '@/lib/types';

interface DashboardProps {
  data: DayData;
  onUpdate: (updater: (prev: DayData) => DayData, changedTask?: Task) => void;
  identity: any;
}

export const DashboardView: React.FC<DashboardProps> = ({ data, onUpdate, identity }) => {
  const toggleTask = (task: Task) => {
    onUpdate(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
    }), task);
  };

  const updateWater = (delta: number) => {
    onUpdate(prev => ({ ...prev, waterIntake: Math.max(0, prev.waterIntake + delta) }));
  };

  const sections = [Category.BODY, Category.MIND, Category.DEEN];
  const completion = data.tasks.length > 0 ? Math.round((data.tasks.filter(t => t.completed).length / data.tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Identity Banner */}
      <div className="relative p-8 rounded-3xl overflow-hidden border border-emerald-500/20 bg-emerald-500/5 emerald-glow">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Target size={120} className="text-emerald-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500/60">Active Vision</p>
          <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter">"{identity.vision}"</h1>
          <div className="flex gap-2">
            {identity.coreValues.map((v: string) => (
              <span key={v} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Execution Rate" 
          value={`${completion}%`} 
          sub="Daily Progress"
          icon={<CheckCircle2 className="text-emerald-500" />}
          progress={completion}
        />
        <StatCard 
          label="Deep Focus" 
          value={`${data.deepWorkMinutes}m`} 
          sub="Time in Flow"
          icon={<Clock className="text-zinc-500" />}
        />
        <div className="p-6 rounded-2xl glass-card border-zinc-800 space-y-4">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hydration</p>
                <p className="text-3xl font-black">{data.waterIntake.toFixed(1)} <span className="text-lg text-zinc-600">L</span></p>
              </div>
              <Droplets className="text-blue-500" size={24} />
           </div>
           <div className="flex gap-2">
              <button onClick={() => updateWater(-0.5)} className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors flex justify-center"><Minus size={16} /></button>
              <button onClick={() => updateWater(0.5)} className="flex-1 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex justify-center"><Plus size={16} /></button>
           </div>
        </div>
      </div>

      {/* Task Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map(section => (
          <div key={section} className="space-y-5">
            <h3 className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {section}
            </h3>
            <div className="space-y-3">
              {data.tasks.filter(t => t.category === section).map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all duration-300 group ${
                    task.completed 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{task.label}</span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-700 group-hover:bg-zinc-800'
                  }`}>
                    {task.completed && <CheckCircle2 size={14} strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon, progress }: any) => (
  <div className="p-6 rounded-2xl glass-card border-zinc-800 relative overflow-hidden">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
      {icon}
    </div>
    <p className="text-3xl font-black mb-1">{value}</p>
    <p className="text-[10px] text-zinc-600 font-bold uppercase">{sub}</p>
    {progress !== undefined && (
      <div className="mt-4 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-emerald-500 transition-all duration-1000" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    )}
  </div>
);

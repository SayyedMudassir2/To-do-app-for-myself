
import React from 'react';
import { Check, Droplets, Clock, Zap, Target } from 'lucide-react';
import { DayData, Task, Category } from '../types';

interface DashboardProps {
  data: DayData;
  onUpdate: (updater: (prev: DayData) => DayData, task?: Task) => void;
  identity: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onUpdate, identity }) => {
  const toggleTask = (task: Task) => {
    onUpdate(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
    }), task);
  };

  const updateWater = (val: number) => {
    onUpdate(prev => ({ ...prev, waterIntake: Math.max(0, val) }));
  };

  const sections = [Category.BODY, Category.MIND, Category.DEEN];
  const completionPercentage = data.tasks.length > 0 ? Math.round((data.tasks.filter(t => t.completed).length / data.tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Identity Header */}
      <section className="p-6 rounded-2xl bg-zinc-950 border border-emerald-500/20 emerald-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target size={120} />
        </div>
        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">2026 Identity</h3>
        <h2 className="text-2xl md:text-3xl font-black mb-4">"{identity.vision}"</h2>
        <div className="flex flex-wrap gap-2">
          {identity.coreValues.map((v: string) => (
            <span key={v} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">{v}</span>
          ))}
        </div>
      </section>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl glass border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Daily Completion</p>
            <p className="text-3xl font-black">{completionPercentage}%</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center relative">
            <svg className="w-16 h-16 absolute -rotate-90">
              <circle
                cx="32" cy="32" r="28"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                className="text-emerald-500"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - completionPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <Check className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="p-6 rounded-2xl glass border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Deep Work</p>
            <p className="text-3xl font-black">{data.deepWorkMinutes}m</p>
          </div>
          <Clock className="text-zinc-500" size={32} />
        </div>

        <div className="p-6 rounded-2xl glass border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Water Intake</p>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={data.waterIntake} 
                onChange={e => updateWater(parseFloat(e.target.value))}
                className="bg-transparent text-3xl font-black w-16 focus:outline-none"
              />
              <span className="text-xl font-bold text-zinc-600">L</span>
            </div>
          </div>
          <Droplets className="text-blue-500" size={32} />
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map(section => (
          <div key={section} className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {section}
            </h4>
            <div className="space-y-2">
              {data.tasks.filter(t => t.category === section).map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all group ${
                    task.completed 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${task.completed ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {task.label}
                  </span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'
                  }`}>
                    {task.completed && <Check size={16} strokeWidth={3} />}
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

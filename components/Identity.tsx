
import React from 'react';
import { Plus, Trash2, ShieldCheck, Sword, Zap } from 'lucide-react';
import { IdentityProfile } from '../types';

interface IdentityProps {
  profile: IdentityProfile;
  onUpdate: (profile: Partial<IdentityProfile>) => void;
}

export const Identity: React.FC<IdentityProps> = ({ profile, onUpdate }) => {
  const handleAddItem = (key: keyof IdentityProfile, value: string) => {
    if (!value.trim()) return;
    const currentList = profile[key] as string[];
    onUpdate({ [key]: [...currentList, value] });
  };

  const removeItem = (key: keyof IdentityProfile, index: number) => {
    const currentList = profile[key] as string[];
    onUpdate({ [key]: currentList.filter((_, i) => i !== index) });
  };

  const EditableList = ({ title, icon: Icon, items, onAdd, onRemove, colorClass }: any) => {
    const [input, setInput] = React.useState('');
    return (
      <div className="p-6 rounded-2xl glass border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`flex items-center gap-2 font-bold uppercase tracking-wider ${colorClass}`}>
            <Icon size={18} />
            {title}
          </h3>
          <span className="text-xs text-zinc-600 font-bold">{items.length} ACTIVE</span>
        </div>
        <div className="space-y-2">
          {items.map((item: string, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 group">
              <span className="text-sm text-zinc-300">{item}</span>
              <button onClick={() => onRemove(i)} className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(input); setInput(''); } }}
            placeholder="Add new..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button 
            onClick={() => { onAdd(input); setInput(''); }}
            className="p-2 bg-emerald-500 text-black rounded-xl hover:scale-105 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="text-center py-10 space-y-4">
        <h2 className="text-4xl font-black">Identity Architect</h2>
        <p className="text-zinc-500">You don't just 'do' things. You are the man who gets things done.</p>
      </section>

      <div className="p-8 rounded-3xl glass border-emerald-500/20 emerald-glow space-y-4">
        <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Master Vision 2026</label>
        <textarea
          value={profile.vision}
          onChange={(e) => onUpdate({ vision: e.target.value })}
          className="w-full bg-transparent text-3xl font-black focus:outline-none resize-none min-h-[100px]"
          placeholder="Who are you becoming?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EditableList 
          title="Core Values" 
          icon={ShieldCheck} 
          items={profile.coreValues} 
          onAdd={(val: string) => handleAddItem('coreValues', val)}
          onRemove={(idx: number) => removeItem('coreValues', idx)}
          colorClass="text-blue-500"
        />
        <EditableList 
          title="Non-Negotiables" 
          icon={Sword} 
          items={profile.nonNegotiables} 
          onAdd={(val: string) => handleAddItem('nonNegotiables', val)}
          onRemove={(idx: number) => removeItem('nonNegotiables', idx)}
          colorClass="text-emerald-500"
        />
        <EditableList 
          title="Anti-Identity" 
          icon={Zap} 
          items={profile.antiIdentity} 
          onAdd={(val: string) => handleAddItem('antiIdentity', val)}
          onRemove={(idx: number) => removeItem('antiIdentity', idx)}
          colorClass="text-orange-500"
        />
      </div>
    </div>
  );
};

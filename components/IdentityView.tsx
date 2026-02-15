
import React from 'react';
import { Shield, Sword, Ghost, Plus, X } from 'lucide-react';
import { IdentityProfile } from '@/lib/types';

interface IdentityProps {
  profile: IdentityProfile;
  onUpdate: (profile: Partial<IdentityProfile>) => void;
}

export const IdentityView: React.FC<IdentityProps> = ({ profile, onUpdate }) => {
  const addToList = (key: keyof IdentityProfile, val: string) => {
    if (!val.trim()) return;
    onUpdate({ [key]: [...(profile[key] as string[]), val] });
  };

  const removeFromList = (key: keyof IdentityProfile, idx: number) => {
    onUpdate({ [key]: (profile[key] as string[]).filter((_, i) => i !== idx) });
  };

  return (
    <div className="max-w-4xl space-y-10 py-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Identity Architect</h1>
        <p className="text-zinc-500 text-sm font-medium italic">We do not rise to the level of our goals, we fall to the level of our systems.</p>
      </header>

      <div className="p-8 rounded-3xl glass-card border-emerald-500/20 space-y-4">
        <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">Primary Proclamation</p>
        <textarea
          value={profile.vision}
          onChange={(e) => onUpdate({ vision: e.target.value })}
          className="w-full bg-transparent text-3xl md:text-5xl font-black tracking-tighter focus:outline-none resize-none border-none placeholder:text-zinc-800"
          placeholder="Who are you?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IdentityBlock 
          title="Core Values" 
          icon={<Shield size={16} />} 
          items={profile.coreValues} 
          onAdd={(v) => addToList('coreValues', v)} 
          onRemove={(i) => removeFromList('coreValues', i)}
          color="text-blue-500"
        />
        <IdentityBlock 
          title="Non-Negotiables" 
          icon={<Sword size={16} />} 
          items={profile.nonNegotiables} 
          onAdd={(v) => addToList('nonNegotiables', v)} 
          onRemove={(i) => removeFromList('nonNegotiables', i)}
          color="text-emerald-500"
        />
        <IdentityBlock 
          title="Anti-Identity" 
          icon={<Ghost size={16} />} 
          items={profile.antiIdentity} 
          onAdd={(v) => addToList('antiIdentity', v)} 
          onRemove={(i) => removeFromList('antiIdentity', i)}
          color="text-orange-500"
        />
      </div>
    </div>
  );
};

const IdentityBlock = ({ title, icon, items, onAdd, onRemove, color }: any) => {
  const [input, setInput] = React.useState('');
  return (
    <div className="p-6 rounded-2xl glass-card space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
        {icon} {title}
      </div>
      <div className="space-y-2 min-h-[100px]">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 group">
            <span className="text-xs font-medium text-zinc-300">{item}</span>
            <button onClick={() => onRemove(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-500"><X size={14} /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { onAdd(input); setInput(''); } }}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs focus:border-zinc-600 focus:outline-none"
          placeholder="Define..."
        />
        <button onClick={() => { onAdd(input); setInput(''); }} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"><Plus size={14} /></button>
      </div>
    </div>
  );
};

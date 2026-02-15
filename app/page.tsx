
"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  User, 
  Zap, 
  Flame,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useAppState } from '@/lib/store';
import { DashboardView } from '@/components/DashboardView';
import { DeepWorkView } from '@/components/DeepWorkView';
import { IdentityView } from '@/components/IdentityView';

export default function MasteryOS() {
  const { state, isLoaded, updateToday, currentDayData, setTab, updateIdentity, streak } = useAppState();

  if (!isLoaded) return <div className="h-screen w-screen bg-black flex items-center justify-center"><Zap className="animate-pulse text-emerald-500" /></div>;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Deep Work', icon: Target },
    { id: 'identity', label: 'Identity', icon: User },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Navigation */}
      <aside className="hidden md:flex flex-col w-64 p-6 border-r border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center emerald-glow">
            <Zap className="text-black" fill="currentColor" size={20} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-emerald-500">LEVEL 2026</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Mastery OS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                state.activeTab === tab.id 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <tab.icon size={18} strokeWidth={state.activeTab === tab.id ? 2.5 : 2} />
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-4 rounded-2xl glass-card">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-xs font-black text-emerald-500">
              {state.identity.level}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500">Current Level</p>
              <p className="text-sm font-bold">Initiate</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-full bg-black overflow-y-auto">
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 md:py-8 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Zap size={16} fill="currentColor" className="text-black" />
            </div>
            <h2 className="text-lg md:text-2xl font-bold capitalize">{state.activeTab}</h2>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 shadow-inner">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-zinc-600'}`} />
            <span className="text-xs font-bold">{streak} Day Streak</span>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-10 pb-20">
          {state.activeTab === 'dashboard' && <DashboardView data={currentDayData} onUpdate={updateToday} identity={state.identity} />}
          {state.activeTab === 'focus' && <DeepWorkView onUpdate={updateToday} />}
          {state.activeTab === 'identity' && <IdentityView profile={state.identity} onUpdate={updateIdentity} />}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/80 backdrop-blur-xl border-t border-zinc-800">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${state.activeTab === tab.id ? 'text-emerald-500' : 'text-zinc-500'}`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-bold uppercase">{tab.label.substring(0, 4)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

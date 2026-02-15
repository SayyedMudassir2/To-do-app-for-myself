
"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  User, 
  Zap, 
  Flame,
  FileSpreadsheet,
  Download,
  Loader2
} from 'lucide-react';
import { useAppState } from '@/lib/store';
import { DashboardView } from '@/components/DashboardView';
import { DeepWorkView } from '@/components/DeepWorkView';
import { IdentityView } from '@/components/IdentityView';

export default function MasteryOS() {
  const { state, isLoaded, updateToday, currentDayData, setTab, updateIdentity, streak, exportToCSV } = useAppState();

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase">Initializing OS...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Deep Work', icon: Target },
    { id: 'identity', label: 'Identity', icon: User },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black text-zinc-50">
      {/* Navigation - Desktop */}
      <aside className="hidden md:flex flex-col w-72 p-6 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Zap className="text-black" fill="currentColor" size={24} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-white">LEVEL 2026</h1>
            <p className="text-[10px] text-emerald-500 uppercase tracking-[0.2em] font-black">Mastery OS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                state.activeTab === tab.id 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <tab.icon size={20} strokeWidth={state.activeTab === tab.id ? 2.5 : 2} />
              <span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
           <button 
            onClick={exportToCSV}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <FileSpreadsheet size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Export Spreadsheet</span>
            </div>
            <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <div className="p-5 rounded-2xl glass-card border-zinc-800 flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                <span className="text-lg font-black text-emerald-500">{state.identity.level}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                <Zap size={10} className="text-black" fill="currentColor" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Global Rank</p>
              <p className="text-sm font-black text-white italic">Initiate Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 md:py-10 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Zap size={20} fill="currentColor" className="text-black" />
            </div>
            <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase">{state.activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 transition-all"
              title="Export Spreadsheet"
            >
              <FileSpreadsheet size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Export</span>
            </button>
            <div className="flex items-center gap-3 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
              <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-zinc-600'}`} />
              <span className="text-xs font-black tracking-widest uppercase">{streak} Day Streak</span>
            </div>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-12 pb-32">
          {state.activeTab === 'dashboard' && <DashboardView data={currentDayData} onUpdate={updateToday} identity={state.identity} />}
          {state.activeTab === 'focus' && <DeepWorkView onUpdate={updateToday} />}
          {state.activeTab === 'identity' && <IdentityView profile={state.identity} onUpdate={updateIdentity} />}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-900">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-colors ${state.activeTab === tab.id ? 'text-emerald-500' : 'text-zinc-600'}`}
          >
            <tab.icon size={22} strokeWidth={state.activeTab === tab.id ? 3 : 2} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label.substring(0, 4)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

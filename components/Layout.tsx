
import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Zap, 
  User, 
  Flame,
  FileSpreadsheet,
  Download
} from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  level: number;
  streak: number;
  onExport: () => void;
}

const NavItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-full md:flex-row md:justify-start md:gap-3 ${
      active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children, level, streak, onExport }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 p-6 border-r border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Zap className="text-black" fill="currentColor" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">LEVEL 2026</h1>
            <p className="text-xs text-zinc-500 font-medium">REAL MASTERY OS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={onTabChange} />
          <NavItem id="focus" label="Deep Work" icon={Target} active={activeTab === 'focus'} onClick={onTabChange} />
          <NavItem id="identity" label="Identity" icon={User} active={activeTab === 'identity'} onClick={onTabChange} />
          
          <div className="pt-6 mt-6 border-t border-zinc-900">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-3 px-3">Data Management</p>
            <button
              onClick={onExport}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 group"
            >
              <FileSpreadsheet size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold">Export Spreadsheet</span>
            </button>
          </div>
        </nav>

        <div className="mt-auto p-4 rounded-xl glass border-emerald-500/20 flex items-center gap-3">
          <div className="relative">
             <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 font-bold">
               {level}
             </div>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Current Tier</p>
            <p className="text-emerald-500 font-bold">Lvl {level}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 md:px-8 md:py-6 glass border-b md:border-transparent">
          <div className="flex items-center gap-4 md:hidden">
             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Zap size={16} />
             </div>
             <span className="font-bold">LEVEL 2026</span>
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             <button 
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                title="Export Spreadsheet"
             >
               <FileSpreadsheet size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Export</span>
             </button>
             <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-3 py-1.5 border border-zinc-800">
               <Flame size={16} className={streak > 0 ? "text-orange-500" : "text-zinc-600"} />
               <span className="text-xs font-bold whitespace-nowrap">{streak} Day Streak</span>
             </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-zinc-800 px-2 py-2 flex justify-around items-center">
        <NavItem id="dashboard" label="Dash" icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={onTabChange} />
        <NavItem id="focus" label="Focus" icon={Target} active={activeTab === 'focus'} onClick={onTabChange} />
        <NavItem id="identity" label="Identity" icon={User} active={activeTab === 'identity'} onClick={onTabChange} />
      </nav>
    </div>
  );
};

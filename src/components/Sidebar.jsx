import React from 'react';
import {
  Flame,
  Sparkles,
  Hash,
  CalendarClock,
  TrendingUp,
  MessageSquareCode,
  Share2,
  Bot
} from 'lucide-react';

export const NAVIGATION_TABS = [
  { id: 'radar', label: 'Radar de Niches', icon: Flame, badge: 'Hot' },
  { id: 'studio', label: 'Studio IA Multi-Format', icon: Sparkles, badge: 'Nouveau' },
  { id: 'hashtags', label: 'Optimiseur Hashtags', icon: Hash },
  { id: 'scheduler', label: 'Pilote & Calendrier', icon: CalendarClock },
  { id: 'predictor', label: 'Simulateur Viralité', icon: TrendingUp },
  { id: 'copilot', label: 'Copilote IA Chat', icon: MessageSquareCode },
  { id: 'channels', label: 'Canaux & Webhooks', icon: Share2 },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-full md:w-64 shrink-0 p-3 md:p-4 border-b md:border-b-0 md:border-r border-cyber-border/70 glass-panel md:min-h-[calc(100vh-4rem)] flex md:flex-col justify-between">
      <div className="w-full">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 hidden md:block">
          Navigation Principale
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
          {NAVIGATION_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap text-left ${isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border border-indigo-500/50 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                  }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="flex-1">{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase hidden lg:inline-block ${tab.badge === 'Hot' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Autonomous Bot Info Card (Desktop Only) */}
      <div className="hidden md:block p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-indigo-400 animate-bounce" />
          <span className="text-xs font-semibold text-slate-200">Algorithme 2026 Ready</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Optimisé pour les derniers signaux de rétention sur TikTok, X, LinkedIn et Instagram.
        </p>
      </div>
    </aside>
  );
}

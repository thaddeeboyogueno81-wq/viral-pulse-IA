import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Settings, Radio, Crown, ArrowUp } from 'lucide-react';
import { getCurrentPlan, getQuota, PLAN_LIMITS } from '../services/planService';

export default function Navbar({ autopilotActive, onToggleAutopilot, onOpenSettings, onOpenPricing, scheduledCount = 0 }) {
  const [plan, setPlan] = useState(getCurrentPlan());
  const [quota, setQuota] = useState(getQuota('generations'));

  // Rafraîchir le plan/quota quand la fenêtre reprend le focus (après activation licence)
  useEffect(() => {
    const refresh = () => {
      setPlan(getCurrentPlan());
      setQuota(getQuota('generations'));
    };
    window.addEventListener('focus', refresh);
    window.addEventListener('viralpulse:plan-updated', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('viralpulse:plan-updated', refresh);
    };
  }, []);

  const planInfo = PLAN_LIMITS[plan];

  const planBadgeStyle = {
    free: 'bg-slate-700/80 text-slate-300 border-slate-600',
    pro: 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-glow-purple',
    business: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/50',
  };

  const quotaPercent = quota.isUnlimited
    ? 100
    : Math.round((quota.used / Number(quota.limit)) * 100);

  const quotaColor = quota.isUnlimited
    ? 'bg-emerald-500'
    : quotaPercent >= 100
      ? 'bg-red-500'
      : quotaPercent >= 66
        ? 'bg-amber-500'
        : 'bg-indigo-500';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border/70 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-glow-purple">
            <div className="w-full h-full bg-[#0d121f] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/30" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Viral<span className="text-gradient-purple">Pulse</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI 2.0
              </span>
            </div>
            <p className="text-[11px] text-cyber-subtext hidden sm:block">
              Radar de Niches & Pilote Automatique Multi-Réseaux
            </p>
          </div>
        </div>

        {/* Center — Autopilot + Plan Badge */}
        <div className="flex items-center gap-2">
          {/* Plan Badge */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${planBadgeStyle[plan]}`}>
            {plan === 'business' && <Crown className="w-3 h-3" />}
            {plan === 'pro' && <Sparkles className="w-3 h-3" />}
            {planInfo.badge}
          </div>

          {/* Quota Indicator (visible Free & Pro) */}
          {!quota.isUnlimited && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700">
              <span className="text-[10px] text-slate-400">Générations :</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${quotaColor}`}
                    style={{ width: `${Math.min(100, quotaPercent)}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${quotaPercent >= 100 ? 'text-red-400' : 'text-slate-300'}`}>
                  {quota.used}/{quota.limit}
                </span>
              </div>
            </div>
          )}

          {/* Autopilot Toggle */}
          <button
            onClick={onToggleAutopilot}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
              autopilotActive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-glow-green'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {autopilotActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${autopilotActive ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            </span>
            <span className="hidden sm:inline">Pilote :</span>
            <span className="font-semibold">{autopilotActive ? 'ACTIF' : 'PAUSE'}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* Queue count */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/80 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>File :</span>
            <span className="font-bold text-white px-1.5 py-0.5 rounded bg-indigo-600/50 text-[11px]">
              {scheduledCount}
            </span>
          </div>

          {/* Upgrade Button (visible Free only) */}
          {plan === 'free' && (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-glow-purple animate-pulse-glow"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upgrade Pro</span>
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Paramètres & Clés API"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}

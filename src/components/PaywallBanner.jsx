import React from 'react';
import { Lock, Zap, ArrowRight, Star } from 'lucide-react';

/**
 * PaywallBanner — Bannière de blocage contextuelle
 * S'affiche quand le quota est dépassé ou qu'une feature est verrouillée
 */
export default function PaywallBanner({
  type = 'quota',       // 'quota' | 'feature'
  feature = '',         // nom de la feature verrouillée
  quotaType = 'generations',  // 'generations' | 'chat' | 'hashtag'
  onUpgrade,
  compact = false,
}) {
  const messages = {
    quota: {
      generations: {
        title: 'Quota journalier atteint 🎯',
        desc: 'Vous avez utilisé vos 3 générations gratuites aujourd\'hui. Revenez demain ou passez au plan Pro pour 30 générations par jour.',
      },
      chat: {
        title: 'Limite de messages atteinte 💬',
        desc: 'Vous avez utilisé vos 5 messages Copilote gratuits aujourd\'hui. Passez au plan Pro pour un chat illimité.',
      },
      hashtag: {
        title: 'Limite hashtags atteinte 🏷️',
        desc: 'Vous avez utilisé votre analyse hashtag gratuite du jour. Pro débloque les recherches illimitées.',
      },
    },
    feature: {
      autopilot: {
        title: 'Pilote Automatique — Plan Pro requis 🤖',
        desc: 'Le pilote automatique est une fonctionnalité exclusive Pro. Planifiez, automatisez et publiez sans lever le petit doigt.',
      },
      platform: {
        title: `${feature} — Plan Pro requis 🔒`,
        desc: 'Cette plateforme est disponible à partir du plan Pro. Débloquez TikTok, Instagram, YouTube Shorts et Threads.',
      },
      downloadContent: {
        title: 'Téléchargement — Plan Pro requis 📥',
        desc: 'Téléchargez vos contenus générés en TXT / JSON. Disponible à partir du plan Pro.',
      },
      viralityAdvanced: {
        title: 'Analyse Avancée — Plan Pro requis 📊',
        desc: 'L\'analyse de viralité avancée avec recommandations IA est réservée au plan Pro.',
      },
    },
  };

  const msg = type === 'quota'
    ? messages.quota[quotaType] || messages.quota.generations
    : messages.feature[feature] || { title: `${feature} — Plan Pro requis`, desc: 'Passez au plan Pro pour accéder à cette fonctionnalité.' };

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/50 border border-indigo-500/40">
        <div className="flex items-center gap-2 min-w-0">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs text-slate-300 truncate">{msg.title}</span>
        </div>
        <button
          onClick={onUpgrade}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-glow-purple"
        >
          <Zap className="w-3 h-3" />
          Upgrade
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/70 via-purple-950/60 to-slate-950/80 p-6 text-center">
      {/* Glow decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/10 pointer-events-none" />
      
      {/* Lock Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center shadow-glow-purple">
          <Lock className="w-7 h-7 text-indigo-300" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-base font-bold text-white mb-2">{msg.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-sm mx-auto">{msg.desc}</p>

      {/* Features sneak peek */}
      <div className="flex flex-wrap justify-center gap-2 mb-5">
        {['30 générations/jour', 'Toutes les plateformes', 'Copilote illimité', 'Pilote Automatique'].map(f => (
          <span key={f} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-medium">
            <Star className="w-3 h-3 text-yellow-400" />
            {f}
          </span>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={onUpgrade}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-glow-purple animate-pulse-glow"
        >
          <Zap className="w-4 h-4" />
          Passer au plan Pro — 9,99€/mois
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {type === 'quota' && (
        <p className="mt-3 text-[11px] text-slate-500">
          ⏰ Votre quota gratuit se réinitialise automatiquement à minuit
        </p>
      )}
    </div>
  );
}

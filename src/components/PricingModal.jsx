import React, { useState } from 'react';
import { X, Check, Crown, Zap, Star, ArrowRight, Lock } from 'lucide-react';
import { PRICING_PLANS, getCurrentPlan, PLAN_LIMITS } from '../services/planService';

/**
 * PricingModal — Page de tarifs premium avec 3 plans
 */
export default function PricingModal({ isOpen, onClose, onActivateLicense }) {
  if (!isOpen) return null;

  const currentPlan = getCurrentPlan();
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const planColors = {
    free: { border: 'border-slate-700', bg: 'bg-slate-900/50', badge: 'bg-slate-800 text-slate-300' },
    pro: { border: 'border-indigo-500/70', bg: 'bg-indigo-950/40', badge: 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/40' },
    business: { border: 'border-emerald-500/50', bg: 'bg-emerald-950/30', badge: 'bg-emerald-600/40 text-emerald-200 border border-emerald-500/40' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-5xl my-4">

        {/* Header */}
        <div className="text-center mb-8 relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Passez au niveau supérieur
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Choisissez votre <span className="text-gradient-purple">plan ViralPulse</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Commencez gratuitement, évoluez quand vous êtes prêt. Annulez à tout moment.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING_PLANS.map((plan) => {
            const isActive = currentPlan === plan.id;
            const colors = planColors[plan.id];
            const isHovered = hoveredPlan === plan.id;

            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden
                  ${colors.border} ${colors.bg}
                  ${plan.highlight ? 'shadow-glow-purple scale-[1.02]' : ''}
                  ${isHovered && !plan.highlight ? 'border-opacity-100 shadow-lg' : ''}
                `}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold
                      ${plan.id === 'pro' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}
                    `}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Active Plan Indicator */}
                {isActive && (
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                      ✓ Plan actuel
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Plan Name & Price */}
                  <div className="mb-5 mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      {plan.id === 'free' && <Star className="w-4 h-4 text-slate-400" />}
                      {plan.id === 'pro' && <Zap className="w-4 h-4 text-indigo-400" />}
                      {plan.id === 'business' && <Crown className="w-4 h-4 text-emerald-400" />}
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        plan.id === 'free' ? 'text-slate-400' :
                        plan.id === 'pro' ? 'text-indigo-400' : 'text-emerald-400'
                      }`}>{plan.name}</span>
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-extrabold text-white">{plan.priceLabel}</span>
                      {plan.period && (
                        <span className="text-slate-400 text-sm pb-1">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>

                  {/* Features Included */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          plan.id === 'free' ? 'text-slate-400' :
                          plan.id === 'pro' ? 'text-indigo-400' : 'text-emerald-400'
                        }`} />
                        {f}
                      </li>
                    ))}
                    {plan.locked?.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                        <Lock className="w-3 h-3 shrink-0 mt-0.5 text-slate-700" />
                        <span className="line-through">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {plan.id === 'free' ? (
                    <button
                      disabled={isActive}
                      onClick={onClose}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-200 transition-all disabled:opacity-40"
                    >
                      {isActive ? '✓ Plan actuel' : 'Continuer gratuitement'}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {/* Stripe Payment Button */}
                      <a
                        href={plan.stripeLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all
                          ${plan.id === 'pro'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow-purple'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                          }
                          ${isActive ? 'opacity-50 pointer-events-none' : ''}
                        `}
                      >
                        {isActive ? '✓ Actif' : (
                          <>
                            Passer au plan {plan.name}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </a>
                      {/* Activate License Key */}
                      <button
                        onClick={() => { onClose(); onActivateLicense(); }}
                        className="w-full py-2 rounded-xl text-[11px] text-slate-500 hover:text-slate-300 transition-colors border border-slate-800 hover:border-slate-700"
                      >
                        J'ai déjà une clé de licence →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-600 mt-6">
          🔒 Paiement sécurisé par Stripe · Annulation à tout moment · Pas de frais cachés
        </p>
      </div>
    </div>
  );
}

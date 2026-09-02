import React, { useState } from 'react';
import { X, Key, CheckCircle2, AlertCircle, ExternalLink, Sparkles, Copy } from 'lucide-react';
import { activateLicense, generateDemoKey, getCurrentPlan, PLAN_LIMITS } from '../services/planService';

/**
 * LicenseActivator — Modal d'activation de clé de licence après paiement Stripe
 */
export default function LicenseActivator({ isOpen, onClose, onPlanActivated }) {
  if (!isOpen) return null;

  const [licenseKey, setLicenseKey] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoKey, setDemoKey] = useState('');

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setResult({ success: false, message: 'Veuillez entrer votre clé de licence.' });
      return;
    }
    setLoading(true);
    setResult(null);

    // Simulation d'un délai réseau
    await new Promise(r => setTimeout(r, 800));
    const res = activateLicense(licenseKey);
    setResult(res);
    setLoading(false);

    if (res.success) {
      setTimeout(() => {
        if (onPlanActivated) onPlanActivated(res.plan);
        onClose();
      }, 1800);
    }
  };

  const handleGenerateDemoKey = (plan) => {
    const key = generateDemoKey(plan);
    setDemoKey(key);
    setLicenseKey(key);
    setResult(null);
  };

  const currentPlan = getCurrentPlan();
  const planInfo = PLAN_LIMITS[currentPlan];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 to-purple-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40">
              <Key className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Activer votre Licence ViralPulse</h3>
              <p className="text-[11px] text-slate-400">Entrez votre clé reçue après le paiement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Current Plan Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">Plan actuel :</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              currentPlan === 'free' ? 'bg-slate-700 text-slate-300' :
              currentPlan === 'pro' ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/40' :
              'bg-emerald-600/40 text-emerald-200 border border-emerald-500/40'
            }`}>
              {planInfo.badge} — {planInfo.label}
            </span>
          </div>

          {/* License Key Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Clé de licence (format : VPAI-PRO-XXXXXXXX) :</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => { setLicenseKey(e.target.value.toUpperCase()); setResult(null); }}
                placeholder="VPAI-PRO-A1B2C3D4"
                className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono tracking-wider"
              />
              <button
                onClick={handleActivate}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-glow-purple"
              >
                {loading ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                {loading ? 'Validation...' : 'Activer'}
              </button>
            </div>
          </div>

          {/* Result Banner */}
          {result && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              result.success
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/15 border-red-500/40 text-red-300'
            }`}>
              {result.success
                ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              }
              <span>{result.message}</span>
            </div>
          )}

          {/* Stripe Links */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400">Obtenir une licence :</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://buy.stripe.com/test_viralpulse_pro"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-950/70 text-indigo-300 text-xs font-bold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Pro — 9,99€/mois
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="https://buy.stripe.com/test_viralpulse_business"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 text-xs font-bold transition-all"
              >
                🚀 Business — 29,99€/mois
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Demo Keys Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[11px] text-slate-500">🔑 Générer une clé de démo (test uniquement) :</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateDemoKey('pro')}
                className="flex-1 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-white text-[11px] font-semibold transition-all"
              >
                Clé Demo Pro
              </button>
              <button
                onClick={() => handleGenerateDemoKey('business')}
                className="flex-1 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-white text-[11px] font-semibold transition-all"
              >
                Clé Demo Business
              </button>
            </div>
            {demoKey && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700">
                <span className="text-xs font-mono text-cyan-400">{demoKey}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(demoKey)}
                  className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

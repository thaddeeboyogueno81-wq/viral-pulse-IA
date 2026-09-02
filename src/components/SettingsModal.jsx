import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Bot, 
  Check, 
  Save, 
  Sparkles, 
  Bell, 
  Sliders, 
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { TRENDING_CATEGORIES } from '../data/trendingNiches';
import { TONE_OPTIONS, testGeminiApiKey } from '../services/aiEngine';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  if (!isOpen) return null;

  const [autopilotSettings, setAutopilotSettings] = useState(StorageService.getAutopilotSettings());
  const [appSettings, setAppSettings] = useState(StorageService.getAppSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState(null);

  const handleTestGemini = async () => {
    if (!appSettings.geminiApiKey || !appSettings.geminiApiKey.trim()) {
      setGeminiTestResult({ success: false, message: 'Veuillez coller une clé API Gemini avant de tester.' });
      return;
    }
    setTestingGemini(true);
    setGeminiTestResult(null);
    try {
      const res = await testGeminiApiKey(appSettings.geminiApiKey.trim(), appSettings.geminiModel);
      setGeminiTestResult(res);
    } catch (e) {
      setGeminiTestResult({ success: false, message: e.message });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleSave = () => {
    StorageService.saveAutopilotSettings(autopilotSettings);
    // Nettoyer les clés
    const cleanedAppSettings = {
      ...appSettings,
      geminiApiKey: appSettings.geminiApiKey?.trim() || '',
      geminiModel: appSettings.geminiModel || 'auto',
      openAiApiKey: appSettings.openAiApiKey?.trim() || ''
    };
    StorageService.saveAppSettings(cleanedAppSettings);
    setSavedSuccess(true);
    if (onSettingsUpdated) onSettingsUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const toggleNiche = (catId) => {
    const list = autopilotSettings.preferredNiches || [];
    if (list.includes(catId)) {
      setAutopilotSettings({
        ...autopilotSettings,
        preferredNiches: list.filter(c => c !== catId)
      });
    } else {
      setAutopilotSettings({
        ...autopilotSettings,
        preferredNiches: [...list, catId]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-cyan-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Paramètres de l'IA & Pilote Automatique</h3>
              <p className="text-xs text-slate-400">Configurez le comportement autonome et les connexions API</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          
          {/* Section 1 : API Keys & Gemini Live */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-purple-950/40 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-cyan-400" />
                Connexion Google Gemini API (Mode Live IA)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Actif & Prêt
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Pour activer les réponses 100% en direct de l'IA Google Gemini (Gemini 3.6 / 3.0 / 2.5 / 2.0 / 1.5 Flash), collez votre clé obtenue sur <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">Google AI Studio</a>.
            </p>

            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  value={appSettings.geminiApiKey || ''}
                  onChange={(e) => {
                    setAppSettings({ ...appSettings, geminiApiKey: e.target.value });
                    setGeminiTestResult(null);
                  }}
                  placeholder="Collez votre clé API Gemini (commençant par AIzaSy...)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
                <button
                  onClick={handleTestGemini}
                  disabled={testingGemini}
                  className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-500/60 text-white font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {testingGemini ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                      <span>Test en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Tester la clé</span>
                    </>
                  )}
                </button>
              </div>

              {/* Gemini Model Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Version du modèle Gemini :</span>
                </div>
                <select
                  value={appSettings.geminiModel || 'auto'}
                  onChange={(e) => {
                    setAppSettings({ ...appSettings, geminiModel: e.target.value });
                    setGeminiTestResult(null);
                  }}
                  className="px-3 py-1 rounded-lg glass-dropdown text-xs text-white border border-slate-700 focus:outline-none"
                >
                  <option value="auto" className="bg-slate-900">✨ Auto (Détection Intelligente Automatique)</option>
                  <option value="gemini-3.6-flash" className="bg-slate-900">🚀 Gemini 3.6 Flash</option>
                  <option value="gemini-3.0-flash" className="bg-slate-900">⚡ Gemini 3.0 Flash</option>
                  <option value="gemini-2.5-flash" className="bg-slate-900">⚡ Gemini 2.5 Flash</option>
                  <option value="gemini-2.0-flash" className="bg-slate-900">⚡ Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-flash-latest" className="bg-slate-900">🔹 Gemini 1.5 Flash (Latest)</option>
                  <option value="gemini-1.5-pro" className="bg-slate-900">🧠 Gemini 1.5 Pro</option>
                </select>
              </div>

              {/* Gemini Test Feedback Banner */}
              {geminiTestResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  geminiTestResult.success 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                    : 'bg-red-500/15 border-red-500/40 text-red-300'
                }`}>
                  {geminiTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  )}
                  <span>{geminiTestResult.message}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Clé OpenAI API (Optionnel) :</label>
                <input
                  type="password"
                  value={appSettings.openAiApiKey || ''}
                  onChange={(e) => setAppSettings({ ...appSettings, openAiApiKey: e.target.value })}
                  placeholder="sk-proj-..."
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Autopilot Mode */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              Mode de Fonctionnement du Pilote Automatique
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setAutopilotSettings({ ...autopilotSettings, mode: 'approval' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  autopilotSettings.mode === 'approval'
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-glow-purple'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold text-sm mb-1 text-cyan-300">Copilote (Validation 1-Clic)</div>
                <div className="text-[11px] leading-relaxed">
                  L'IA prépare tous les posts dans la file d'attente. Vous validez d'un clic avant envoi.
                </div>
              </label>

              <label
                onClick={() => setAutopilotSettings({ ...autopilotSettings, mode: 'full_auto' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  autopilotSettings.mode === 'full_auto'
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-glow-purple'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold text-sm mb-1 text-emerald-400">100% Autonome (Full Auto)</div>
                <div className="text-[11px] leading-relaxed">
                  L'IA explore, génère, score et programme directement sans intervention humaine.
                </div>
              </label>
            </div>
          </div>

          {/* Section 3 : Frequency & Niches */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <label className="font-bold text-white">Fréquence de publication quotidienne :</label>
              <select
                value={autopilotSettings.postsPerDay || 3}
                onChange={(e) => setAutopilotSettings({ ...autopilotSettings, postsPerDay: Number(e.target.value) })}
                className="px-3 py-1.5 rounded-lg glass-dropdown border border-slate-700 text-white"
              >
                <option value={1}>1 post / jour</option>
                <option value={2}>2 posts / jour</option>
                <option value={3}>3 posts / jour (Recommandé)</option>
                <option value={5}>5 posts / jour (Ultra-croissance)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-white block mb-2">Niches de prédilection à explorer :</label>
              <div className="flex flex-wrap gap-2">
                {TRENDING_CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                  const isChecked = autopilotSettings.preferredNiches?.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleNiche(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold"
          >
            Fermer
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-purple transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Enregistré & Activé !</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Sauvegarder les réglages</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

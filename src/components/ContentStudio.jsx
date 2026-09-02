import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Send, 
  Share2, 
  TrendingUp, 
  Wand2, 
  RefreshCw, 
  Sliders, 
  Eye,
  Download,
  Image as ImageIcon,
  MessageSquare,
  Flame,
  Award,
  BookOpen,
  Zap
} from 'lucide-react';
import { TONE_OPTIONS, FORMAT_TEMPLATES, generateMultiPlatformContent, calculateViralityScore } from '../services/aiEngine';
import { VIRAL_HOOK_FORMULAS } from '../data/viralHooks';
import { StorageService } from '../services/storage';

export default function ContentStudio({ initialNiche = null, onScheduleSuccess }) {
  const [topic, setTopic] = useState(initialNiche ? initialNiche.title : 'Agents IA Autonomes & Workflows No-Code');
  const [category, setCategory] = useState(initialNiche ? initialNiche.category : 'ai-tech');
  const [selectedTone, setSelectedTone] = useState('expert');
  const [customHook, setCustomHook] = useState(initialNiche?.recommendedHooks?.[0] || '');
  const [activePlatformTab, setActivePlatformTab] = useState('twitter');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scheduledStatus, setScheduledStatus] = useState(null);

  // Mettre à jour si initialNiche change
  useEffect(() => {
    if (initialNiche) {
      setTopic(initialNiche.title);
      setCategory(initialNiche.category);
      if (initialNiche.recommendedHooks?.[0]) {
        setCustomHook(initialNiche.recommendedHooks[0]);
      }
    }
  }, [initialNiche]);

  // Génération automatique initiale
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setScheduledStatus(null);
    try {
      const data = await generateMultiPlatformContent({
        topic,
        category,
        tone: selectedTone,
        customHook: customHook.trim()
      });
      setGeneratedData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPlatformContent = generatedData?.platforms?.[activePlatformTab];

  const handleCopy = () => {
    if (!currentPlatformContent) return;
    navigator.clipboard.writeText(currentPlatformContent.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSchedulePost = () => {
    if (!currentPlatformContent || !generatedData) return;
    const newPost = StorageService.addScheduledPost({
      title: `${topic} (${currentPlatformContent.title})`,
      topic: topic,
      category: category,
      platform: activePlatformTab,
      content: currentPlatformContent.content,
      hashtags: currentPlatformContent.hashtags,
      viralityScore: currentPlatformContent.viralityScore,
      estimatedImpressions: currentPlatformContent.estimatedImpressions,
      status: 'scheduled',
      scheduledFor: new Date(Date.now() + 3600 * 1000 * 3).toISOString(),
      tone: selectedTone,
      visualPrompt: generatedData.visualPrompt
    });
    setScheduledStatus('Post ajouté au calendrier avec succès !');
    if (onScheduleSuccess) onScheduleSuccess(newPost);
    setTimeout(() => setScheduledStatus(null), 3500);
  };

  const handleDirectPublish = () => {
    if (!currentPlatformContent || !generatedData) return;
    const newPost = StorageService.addScheduledPost({
      title: `${topic} (${currentPlatformContent.title})`,
      topic: topic,
      category: category,
      platform: activePlatformTab,
      content: currentPlatformContent.content,
      hashtags: currentPlatformContent.hashtags,
      viralityScore: currentPlatformContent.viralityScore,
      estimatedImpressions: currentPlatformContent.estimatedImpressions,
      status: 'published',
      publishedAt: new Date().toISOString(),
      tone: selectedTone,
      visualPrompt: generatedData.visualPrompt
    });
    setScheduledStatus('Post publié instantanément sur les canaux connectés !');
    if (onScheduleSuccess) onScheduleSuccess(newPost);
    setTimeout(() => setScheduledStatus(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header & Configuration Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-card-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Studio IA Haute Performance
              </div>
              {generatedData && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  generatedData.isLiveAI 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-green' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {generatedData.isLiveAI ? '✨ Google Gemini 1.5 Flash (Direct API)' : '⚡ Moteur Autonome 2.0'}
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Générateur Multi-Plateformes & Repurposing Intelligent
            </h2>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple active:scale-95 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Génération des 6 formats en cours...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-cyan-300" />
                <span>Régénérer tous les réseaux</span>
              </>
            )}
          </button>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Topic input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Sujet / Idée Principale du Contenu :
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Comment automatiser 10h de prospection avec des agents IA..."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Tonalité & Angle Psychologique :
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-dropdown text-xs text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {TONE_OPTIONS.map((tone) => (
                <option key={tone.id} value={tone.id} className="bg-slate-900 text-white">
                  {tone.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Custom Hook Selection / Input */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Hook Viral Personnalisé (Optionnel) :
            </label>
            
            {/* Quick Hook Injector Dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) setCustomHook(e.target.value);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 border border-indigo-500/30 focus:outline-none"
            >
              <option value="">⚡ Insérer un hook éprouvé...</option>
              {VIRAL_HOOK_FORMULAS.map((h) => (
                <option key={h.id} value={h.example} className="bg-slate-900 text-slate-200">
                  [{h.category.toUpperCase()}] {h.title}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={customHook}
            onChange={(e) => setCustomHook(e.target.value)}
            placeholder="Ex: 99% des gens font cette erreur critique..."
            className="w-full px-4 py-2 rounded-xl glass-input text-xs text-slate-200"
          />
        </div>
      </div>

      {/* Success Notification */}
      {scheduledStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{scheduledStatus}</span>
        </div>
      )}

      {/* Main Studio Workspace: Platform Tabs & Output */}
      {generatedData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center 2 Columns: Platform Content & Editor */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Platform Tab Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FORMAT_TEMPLATES.map((format) => {
                const isActive = activePlatformTab === format.id;
                return (
                  <button
                    key={format.id}
                    onClick={() => setActivePlatformTab(format.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-purple'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{format.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
                      {generatedData.platforms[format.id]?.viralityScore}/100
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content Editor Panel */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {currentPlatformContent?.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Portée estimée : <strong className="text-cyan-400">{currentPlatformContent?.estimatedImpressions}</strong>
                  </span>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                rows={16}
                value={currentPlatformContent?.content || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setGeneratedData(prev => ({
                    ...prev,
                    platforms: {
                      ...prev.platforms,
                      [activePlatformTab]: {
                        ...prev.platforms[activePlatformTab],
                        content: val
                      }
                    }
                  }));
                }}
                className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-indigo-500/80 resize-y"
              />

              {/* Publishing Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Caractères : <strong className="text-slate-200">{currentPlatformContent?.content?.length || 0}</strong></span>
                  <span>•</span>
                  <span>Mots : <strong className="text-slate-200">{currentPlatformContent?.content?.split(/\s+/).filter(Boolean).length || 0}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSchedulePost}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-indigo-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Planifier</span>
                  </button>

                  <button
                    onClick={handleDirectPublish}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-green active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier Direct</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Virality Predictor & Visual AI Prompt Generator */}
          <div className="space-y-4">
            
            {/* Virality Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Score Prédictif de Viralité
                </span>
                <span className="text-lg font-black text-emerald-400">
                  {currentPlatformContent?.viralityScore}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full"
                  style={{ width: `${currentPlatformContent?.viralityScore || 80}%` }}
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Puissance du Hook :</span>
                  <span className="font-semibold text-emerald-300">96% (Exceptionnel)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Structure Rétention :</span>
                  <span className="font-semibold text-cyan-300">92% (Aéré & Listes)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Engagement Estimé :</span>
                  <span className="font-semibold text-purple-300">{currentPlatformContent?.estimatedEngagement}</span>
                </div>
              </div>
            </div>

            {/* Smart Hashtags Attached */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                #️⃣ Hashtags Recommandés pour ce post
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentPlatformContent?.hashtags?.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/40 text-indigo-300 border border-indigo-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual AI Prompt for Midjourney / Flux */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  Prompt Visuel IA (Midjourney/Flux)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedData.visualPrompt);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                >
                  Copier Prompt
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                {generatedData.visualPrompt}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

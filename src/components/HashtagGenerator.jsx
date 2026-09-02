import React, { useState } from 'react';
import { 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  Plus, 
  X,
  Target,
  BarChart3
} from 'lucide-react';
import { HASHTAG_DATABASE, PLATFORM_HASHTAG_RULES } from '../data/hashtagVault';
import { TRENDING_CATEGORIES } from '../data/trendingNiches';

export default function HashtagGenerator() {
  const [selectedCategory, setSelectedCategory] = useState('ai-tech');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [customKeyword, setCustomKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [copied, setCopied] = useState(false);

  const currentNicheTags = HASHTAG_DATABASE[selectedCategory] || HASHTAG_DATABASE['ai-tech'];
  const currentRules = PLATFORM_HASHTAG_RULES[selectedPlatform] || PLATFORM_HASHTAG_RULES['linkedin'];

  // Auto generate balanced pack based on platform rules
  const handleAutoBundle = () => {
    const t1 = currentNicheTags.tier1.map(t => t.tag);
    const t2 = currentNicheTags.tier2.map(t => t.tag);
    const t3 = currentNicheTags.tier3.map(t => t.tag);
    const ratio = currentRules.preferredTierRatio;

    let bundle = [];
    for (let i = 0; i < ratio.tier1 && i < t1.length; i++) bundle.push(t1[i]);
    for (let i = 0; i < ratio.tier2 && i < t2.length; i++) bundle.push(t2[i]);
    for (let i = 0; i < ratio.tier3 && i < t3.length; i++) bundle.push(t3[i]);

    setSelectedTags(bundle);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < currentRules.maxRecommended + 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleCopyTags = () => {
    if (selectedTags.length === 0) return;
    navigator.clipboard.writeText(selectedTags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOverLimit = selectedTags.length > currentRules.maxRecommended;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-card-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold mb-2">
              <Hash className="w-3.5 h-3.5" />
              Générateur Intelligent & Optimiseur Sémantique
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Hashtags Optimaux par Algorithme & par Palier
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Évitez les pénalités d'algorithme et maximisez votre portée avec la règle des 3 Paliers (Tier 1 / 2 / 3).
            </p>
          </div>

          <button
            onClick={handleAutoBundle}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Générer le pack optimal 1-Clic</span>
          </button>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-800">
          
          {/* Niche Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Niche Thématique :
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedTags([]);
              }}
              className="w-full px-3.5 py-2 rounded-xl glass-dropdown text-xs text-white border border-slate-700"
            >
              {TRENDING_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Réseau Social Cible :
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setSelectedTags([]);
              }}
              className="w-full px-3.5 py-2 rounded-xl glass-dropdown text-xs text-white border border-slate-700"
            >
              <option value="twitter" className="bg-slate-900">X / Twitter (Max 3 tags)</option>
              <option value="linkedin" className="bg-slate-900">LinkedIn (3 à 5 tags d'autorité)</option>
              <option value="instagram" className="bg-slate-900">Instagram (8 à 15 tags équilibrés)</option>
              <option value="tiktok" className="bg-slate-900">TikTok (3 à 5 tags de contenu)</option>
              <option value="youtube" className="bg-slate-900">YouTube Shorts (3 tags précis)</option>
              <option value="threads" className="bg-slate-900">Threads (1 Topic Tag)</option>
            </select>
          </div>

        </div>

        {/* Algorithm Compliance Advice */}
        <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300">Recommandation Algorithme 2026 :</strong> {currentRules.tip}
          </div>
        </div>

      </div>

      {/* Selected Tags Basket Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Votre Pack Sélectionné ({selectedTags.length}/{currentRules.maxRecommended})
            </span>
            {isOverLimit && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                Attention : Risque de pénalité de portée
              </span>
            )}
          </div>

          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Vider
              </button>
              <button
                onClick={handleCopyTags}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-purple"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier le pack'}</span>
              </button>
            </div>
          )}
        </div>

        {selectedTags.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            Cliquez sur les hashtags ci-dessous ou utilisez le bouton "Générer le pack optimal" pour composer votre sélection.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-400/50 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tiered Hashtag Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Tier 1 : Mass Reach */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-orange-400 block uppercase tracking-wider">
                Tier 1 : Portée Globale
              </span>
              <span className="text-[11px] text-slate-400">Volume +5M • Notoriété</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20">
              High Traffic
            </span>
          </div>

          <div className="space-y-1.5">
            {currentNicheTags.tier1.map((item, i) => {
              const isSelected = selectedTags.includes(item.tag);
              return (
                <button
                  key={i}
                  onClick={() => toggleTag(item.tag)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400 text-cyan-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-semibold">{item.tag}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{item.volume}</span>
                    <Plus className={`w-3.5 h-3.5 ${isSelected ? 'rotate-45 text-red-400' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2 : Niche Authority */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">
                Tier 2 : Autorité Niche
              </span>
              <span className="text-[11px] text-slate-400">Volume 500K - 3M • Ciblé</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Sweet Spot
            </span>
          </div>

          <div className="space-y-1.5">
            {currentNicheTags.tier2.map((item, i) => {
              const isSelected = selectedTags.includes(item.tag);
              return (
                <button
                  key={i}
                  onClick={() => toggleTag(item.tag)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400 text-cyan-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-semibold">{item.tag}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{item.volume}</span>
                    <Plus className={`w-3.5 h-3.5 ${isSelected ? 'rotate-45 text-red-400' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 3 : Laser Targeted / Low Competition */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                Tier 3 : Océan Bleu
              </span>
              <span className="text-[11px] text-slate-400">Volume 50K - 400K • Top Rank</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Faible Concurrence
            </span>
          </div>

          <div className="space-y-1.5">
            {currentNicheTags.tier3.map((item, i) => {
              const isSelected = selectedTags.includes(item.tag);
              return (
                <button
                  key={i}
                  onClick={() => toggleTag(item.tag)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400 text-cyan-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="font-semibold">{item.tag}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{item.volume}</span>
                    <Plus className={`w-3.5 h-3.5 ${isSelected ? 'rotate-45 text-red-400' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

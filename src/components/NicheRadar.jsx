import React, { useState } from 'react';
import { 
  Flame, 
  TrendingUp, 
  Search, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  Target, 
  Zap, 
  Eye, 
  Share2,
  CheckCircle2,
  Cpu,
  Rocket,
  ShoppingBag,
  Brain
} from 'lucide-react';
import { TRENDING_CATEGORIES, TRENDING_NICHES } from '../data/trendingNiches';

export default function NicheRadar({ onSelectNicheForStudio }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNicheDetail, setActiveNicheDetail] = useState(null);

  const filteredNiches = TRENDING_NICHES.filter(niche => {
    const matchesCat = selectedCategory === 'all' || niche.category === selectedCategory;
    const matchesSearch = niche.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          niche.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          niche.trendingKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/30 relative overflow-hidden shadow-card-elevated">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            Radar de Niches Explosives en Temps Réel
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Découvrez les sujets qui <span className="text-gradient-fire">explosent actuellement</span>
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Notre IA analyse en permanence les signaux de vélocité, les volumes de recherche et l'indice de saturation pour identifier les opportunités à plus fort potentiel de viralité.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TRENDING_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-purple'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat.id === 'all' && <Sparkles className="w-3.5 h-3.5" />}
                {cat.id === 'ai-tech' && <Cpu className="w-3.5 h-3.5" />}
                {cat.id === 'solopreneur' && <Rocket className="w-3.5 h-3.5" />}
                {cat.id === 'finance-crypto' && <TrendingUp className="w-3.5 h-3.5" />}
                {cat.id === 'productivity' && <Zap className="w-3.5 h-3.5" />}
                {cat.id === 'creator-growth' && <Flame className="w-3.5 h-3.5" />}
                {cat.id === 'ecommerce' && <ShoppingBag className="w-3.5 h-3.5" />}
                {cat.id === 'mindset' && <Brain className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher mot-clé ou sujet..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs glass-input"
          />
        </div>
      </div>

      {/* Grid of Niches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNiches.map((niche) => {
          return (
            <div
              key={niche.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800 relative group transition-all"
            >
              {/* Header card */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* Virality Score Meter */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Viralité {niche.viralityScore}/100</span>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    {niche.growthRate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {niche.title}
                </h3>
                
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {niche.subtitle}
                </p>

                {/* Key Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 my-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Volume recherche :</span>
                    <span className="font-semibold text-slate-200">{niche.searchVolume}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Saturation marché :</span>
                    <span className={`font-semibold ${niche.saturationIndex < 35 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {niche.saturationIndex < 35 ? 'Faible (Océan Bleu)' : 'Moyenne'}
                    </span>
                  </div>
                </div>

                {/* Trending Keywords */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {niche.trendingKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Recommended Hook Preview */}
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 mb-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-indigo-300 mb-1">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    Hook Viral Recommandé :
                  </div>
                  <p className="text-xs italic text-slate-300 line-clamp-2">
                    "{niche.recommendedHooks[0]}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectNicheForStudio(niche)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-glow-purple transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Générer le contenu viral</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}

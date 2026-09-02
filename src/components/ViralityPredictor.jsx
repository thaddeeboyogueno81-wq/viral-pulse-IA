import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  BarChart, 
  Eye, 
  Flame,
  Wand2
} from 'lucide-react';
import { calculateViralityScore } from '../services/aiEngine';

export default function ViralityPredictor() {
  const [draftContent, setDraftContent] = useState(
    `99% des gens pensent qu'il faut 5 ans pour maîtriser l'automatisation par IA.\n\nLa réalité en 2026 ?\nAvec la bonne stack de 3 micro-agents, vous pouvez automatiser 80% de vos tâches en moins de 48h.\n\nVoici le framework exact en 4 étapes 👇\n\n1. Définir le signal déclencheur\n2. Structurer le prompt maître\n3. Connecter la base de données\n4. Automatiser la boucle de publication\n\nQuel processus aimeriez-vous automatiser en priorité ? Dites-le-moi en commentaire !\n\n#AgentsIA #Productivite #IntelligenceArtificielle`
  );
  const [platform, setPlatform] = useState('linkedin');

  const metrics = calculateViralityScore(draftContent, platform);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-cyan-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-card-elevated">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Simulateur & Prédiction de Viralité
            </h2>
            <p className="text-xs text-slate-300">
              Testez vos textes et scripts avant publication pour prédire leur impact algorithmique et booster leur rétention.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Editor */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider">
              Votre Texte ou Script à Analyser :
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-dropdown text-xs text-white border border-slate-700"
            >
              <option value="twitter" className="bg-slate-900">X / Twitter</option>
              <option value="linkedin" className="bg-slate-900">LinkedIn</option>
              <option value="instagram" className="bg-slate-900">Instagram</option>
              <option value="tiktok" className="bg-slate-900">TikTok</option>
            </select>
          </div>

          <textarea
            rows={12}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Collez ou rédigez votre post ici pour lancer le scan..."
            className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 font-sans resize-y"
          />

          {/* Quick AI Refine Suggestions */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Conseils d'Optimisation IA en Direct :
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
              <li>L'accroche contient un chiffre ("99%") : <strong>+15% de taux de clic initial</strong>.</li>
              <li>La mise en page aérée favorise le "Read More" sur mobile.</li>
              <li>L'appel à l'action final avec question ouverte booste le taux de commentaire.</li>
            </ul>
          </div>
        </div>

        {/* Right Col: Score Gauge & Breakdown */}
        <div className="space-y-4">
          
          {/* Main Score Meter Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Score Global de Viralité
            </span>

            <div className="relative inline-flex items-center justify-center">
              <div className={`text-5xl font-black ${getScoreColor(metrics.score)}`}>
                {metrics.score}
              </div>
              <span className="text-slate-500 text-sm font-bold ml-1">/100</span>
            </div>

            <div className="text-xs font-semibold text-slate-300">
              {metrics.score >= 90
                ? '🔥 Potentiel d\'Explosion Viral Maximal'
                : metrics.score >= 75
                ? '⚡ Très Bon Post (Portée Élevée)'
                : '⚠️ Optimisation Recommandée'}
            </div>

            {/* Virality Level Badge */}
            <div className="pt-2">
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${metrics.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Breakdown Meters */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider block pb-1 border-b border-slate-800">
              Analyse par Facteur Clé
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> Force du Hook (0-3s)</span>
                <strong className="text-emerald-400">{metrics.breakdown.hook}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-orange-400" style={{ width: `${metrics.breakdown.hook}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-indigo-400" /> Structure & Rétention</span>
                <strong className="text-cyan-400">{metrics.breakdown.structure}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${metrics.breakdown.structure}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-purple-400" /> Déclencheur Émotionnel</span>
                <strong className="text-purple-400">{metrics.breakdown.emotion}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-400" style={{ width: `${metrics.breakdown.emotion}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> SEO & Hashtags</span>
                <strong className="text-emerald-400">{metrics.breakdown.seo}%</strong>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${metrics.breakdown.seo}%` }} />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

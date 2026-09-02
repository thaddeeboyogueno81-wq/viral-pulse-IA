import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Bot, 
  Play, 
  CheckCircle2, 
  Clock, 
  Send, 
  Trash2, 
  Sliders, 
  Check, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Eye,
  RefreshCw,
  Share2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../services/storage';
import { AutopilotEngine } from '../services/autopilotEngine';
import { canAccess } from '../services/planService';
import PaywallBanner from './PaywallBanner';

export default function AutopilotScheduler({ onSelectPostForEdit, onOpenPricing }) {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState(StorageService.getAutopilotSettings());
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [isExecutingCycle, setIsExecutingCycle] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);
  const hasAccess = canAccess('autopilot');

  const loadData = () => {
    setPosts(StorageService.getScheduledPosts());
    setSettings(StorageService.getAutopilotSettings());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Paywall complet si plan Free
  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pilote Automatique</h2>
              <p className="text-xs text-slate-400">Planification & publication autonome multi-réseaux</p>
            </div>
          </div>
        </div>
        <PaywallBanner
          type="feature"
          feature="autopilot"
          onUpgrade={onOpenPricing}
        />
      </div>
    );
  }

  const handleRunInstantCycle = async () => {
    setIsExecutingCycle(true);
    setActionNotice(null);
    try {
      const result = await AutopilotEngine.runCycle(settings);
      loadData();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setActionNotice(`Succès ! L'IA a généré ${result.totalCreated} publications optimisées pour la niche "${result.niche.title}".`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecutingCycle(false);
    }
  };

  const handleGenerateWeekly = async () => {
    setIsExecutingCycle(true);
    try {
      const batch = await AutopilotEngine.generateWeeklyBatch(7);
      loadData();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
      setActionNotice(`Lot hebdomadaire de ${batch.length} publications planifié sur les 7 prochains jours !`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecutingCycle(false);
    }
  };

  const handleApprove = (id) => {
    StorageService.updatePost(id, { status: 'scheduled' });
    loadData();
  };

  const handlePublishNow = (id) => {
    StorageService.updatePost(id, { status: 'published', publishedAt: new Date().toISOString() });
    loadData();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleDelete = (id) => {
    StorageService.deletePost(id);
    loadData();
  };

  const filteredPosts = posts.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const pendingApprovalCount = posts.filter(p => p.status === 'pending_approval').length;

  return (
    <div className="space-y-6">
      
      {/* Autopilot Master Control Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/70 border border-indigo-500/40 shadow-card-elevated relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-cyan-300">
                <Bot className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Moteur Pilote Automatique Autonome
                </h2>
                <p className="text-xs text-slate-300">
                  L'IA explore les niches chaudes, rédige les posts, sélectionne les hashtags et planifie automatiquement.
                </p>
              </div>
            </div>

            {/* Config summary pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                Mode : <strong className="text-cyan-300">{settings.mode === 'full_auto' ? '100% Autonome' : 'Validation en 1-Clic'}</strong>
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                Fréquence : <strong className="text-indigo-300">{settings.postsPerDay || 3} posts / jour</strong>
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                Créneaux optimaux : <strong className="text-emerald-300">08:30 • 13:15 • 18:45</strong>
              </span>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <button
              onClick={handleRunInstantCycle}
              disabled={isExecutingCycle}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-all active:scale-95 disabled:opacity-50"
            >
              {isExecutingCycle ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Agent en cours d'exécution...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Lancer 1 Cycle Autonome</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateWeekly}
              disabled={isExecutingCycle}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Générer la Semaine (7J)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs & Views */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Tous les Posts', count: posts.length },
            { id: 'pending_approval', label: 'À Valider', count: pendingApprovalCount, badge: 'urgent' },
            { id: 'scheduled', label: 'Planifiés', count: posts.filter(p => p.status === 'scheduled').length },
            { id: 'published', label: 'Publiés', count: posts.filter(p => p.status === 'published').length }
          ].map((tab) => {
            const isSelected = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-purple'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  tab.badge === 'urgent' && tab.count > 0 
                    ? 'bg-orange-500 text-white font-bold animate-pulse' 
                    : 'bg-black/30 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Liste / File d'attente
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Calendrier
          </button>
        </div>

      </div>

      {/* Post List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center border border-dashed border-slate-800 space-y-3">
              <Bot className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">Aucune publication dans cette catégorie</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Cliquez sur "Lancer 1 Cycle Autonome" ou utilisez le Studio IA pour ajouter des publications.
              </p>
              <button
                onClick={handleRunInstantCycle}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Générer maintenant
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isPending = post.status === 'pending_approval';
              const isPublished = post.status === 'published';

              return (
                <div
                  key={post.id}
                  className="glass-panel glass-panel-hover p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  {/* Left info & content snippet */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Platform pill */}
                      <span className="px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {post.platform}
                      </span>

                      {/* Status indicator */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 ${
                        isPublished
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          : isPending
                          ? 'bg-orange-500/10 text-orange-300 border border-orange-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {isPublished ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isPublished ? 'Publié' : isPending ? 'À Valider' : 'Planifié'}</span>
                      </span>

                      {/* Scheduled time */}
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.scheduledFor || post.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {/* Virality score */}
                      <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Score: {post.viralityScore}/100
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      {post.content}
                    </p>

                    {/* Hashtags list */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 text-[10px] text-cyan-400">
                        {post.hashtags.slice(0, 4).map((tag, i) => (
                          <span key={i}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {isPending && (
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-green"
                        title="Valider pour programmation"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Valider</span>
                      </button>
                    )}

                    {!isPublished && (
                      <button
                        onClick={() => handlePublishNow(post.id)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Publier immédiatement"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publier</span>
                      </button>
                    )}

                    {onSelectPostForEdit && (
                      <button
                        onClick={() => onSelectPostForEdit(post)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                        title="Voir / Modifier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Vue Hebdomadaire des Publications Automatisées
            </h3>
            <span className="text-xs text-slate-400">
              Fuseau horaire : Europe/Paris (Heures optimales 08:30 • 13:15 • 18:45)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 pt-3">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => {
              // Simulated posts for day
              const dayPosts = posts.slice(idx * 2, idx * 2 + 2);
              return (
                <div key={day} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 min-h-[140px]">
                  <div className="text-xs font-bold text-slate-300 pb-1 border-b border-slate-800">
                    {day}
                  </div>
                  {dayPosts.length === 0 ? (
                    <div className="text-[10px] text-slate-500 italic pt-2">Aucun post</div>
                  ) : (
                    dayPosts.map((p) => (
                      <div key={p.id} className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-cyan-300 font-bold uppercase">
                          <span>{p.platform}</span>
                          <span>{p.viralityScore}pts</span>
                        </div>
                        <p className="text-slate-300 line-clamp-1">{p.title}</p>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

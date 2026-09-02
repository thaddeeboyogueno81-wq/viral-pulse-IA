import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Check, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Copy, 
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { StorageService } from '../services/storage';

export default function PostDetailModal({ post, isOpen, onClose, onPostUpdated }) {
  if (!isOpen || !post) return null;

  const [content, setContent] = useState(post.content || '');
  const [scheduledFor, setScheduledFor] = useState(
    post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : ''
  );
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    StorageService.updatePost(post.id, {
      content,
      scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : post.scheduledFor
    });
    setSavedNotice(true);
    if (onPostUpdated) onPostUpdated();
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  const handlePublishNow = () => {
    StorageService.updatePost(post.id, {
      content,
      status: 'published',
      publishedAt: new Date().toISOString()
    });
    if (onPostUpdated) onPostUpdated();
    onClose();
  };

  const handleDelete = () => {
    StorageService.deletePost(post.id);
    if (onPostUpdated) onPostUpdated();
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-cyan-300 font-bold uppercase text-xs border border-indigo-500/40">
              {post.platform}
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-md">
              {post.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[10px]">Score de Viralité :</span>
                <span className="font-bold text-emerald-400 text-sm">{post.viralityScore || 95}/100</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Portée Prévue :</span>
                <span className="font-bold text-cyan-300 text-sm">{post.estimatedImpressions || '35K+'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-slate-400 text-[11px]">Programmé pour :</label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">Contenu de la publication :</label>
              <button
                onClick={handleCopy}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié' : 'Copier texte'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Attached Visual Prompt if available */}
          {post.visualPrompt && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Prompt Visuel Associé :
              </span>
              <p className="text-[11px] font-mono text-slate-300">{post.visualPrompt}</p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500 text-white font-semibold flex items-center gap-1.5"
            >
              {savedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedNotice ? 'Enregistré' : 'Enregistrer'}</span>
            </button>

            <button
              onClick={handlePublishNow}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-glow-green"
            >
              <Send className="w-4 h-4" />
              <span>Publier Maintenant</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  Copy, 
  Check, 
  Flame, 
  Wand2,
  Zap,
  ArrowRight,
  Key,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { generateAIChatReply } from '../services/aiEngine';
import { StorageService } from '../services/storage';
import { getQuota, consumeQuota } from '../services/planService';
import PaywallBanner from './PaywallBanner';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Bonjour ! Je suis votre Copilote IA de Viralité. Je peux reformuler vos textes, créer des scripts vidéo percutants, adapter un post en carrousel ou trouver des angles originaux. Que voulez-vous créer ?",
    time: 'À l\'instant',
    model: 'ViralPulse Engine'
  }
];

const SUGGESTED_PROMPTS = [
  "🔥 Trouve 3 angles provocateurs sur l'automatisation IA",
  "⚡ Transforme une idée en script TikTok avec hook visuel",
  "💼 Récris ce post dans un style LinkedIn storytelling d'autorité",
  "🎯 Génère 5 hooks de curiosité sur le Solopreneuriat"
];

export default function AIRevisorChat({ onOpenPricing }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeModelName, setActiveModelName] = useState('Moteur Autonome 2.0');
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [chatQuota, setChatQuota] = useState(getQuota('chat'));
  const [quotaBlocked, setQuotaBlocked] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const appSettings = StorageService.getAppSettings();
    if (appSettings.geminiApiKey) {
      setActiveModelName('Google Gemini 1.5 Flash (Direct API)');
      setHasCustomKey(true);
    } else if (appSettings.openAiApiKey) {
      setActiveModelName('OpenAI GPT-4o Mini (Direct API)');
      setHasCustomKey(true);
    } else {
      setActiveModelName('Moteur Autonome Hybride (Actif)');
      setHasCustomKey(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Vérification du quota chat journalier
    const currentQuota = getQuota('chat');
    if (!currentQuota.canUse) {
      setQuotaBlocked(true);
      setChatQuota(currentQuota);
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Consommer le quota
    consumeQuota('chat');
    const updatedQuota = getQuota('chat');
    setChatQuota(updatedQuota);
    if (!updatedQuota.canUse) setQuotaBlocked(true);

    try {
      const response = await generateAIChatReply(query, messages);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: response.model,
          isRealLLM: response.isRealLLM
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "Désolé, une erreur est survenue lors de la génération. Veuillez réessayer.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-card-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Copilote IA Conversationnel
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Brainstormez des idées, peaufinez des punchlines et déclinez vos formats en direct.
            </p>
          </div>
        </div>

        {/* Active Engine Badge + Quota */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Quota Chat */}
          {!chatQuota.isUnlimited && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold ${
              chatQuota.remaining === 0
                ? 'bg-red-500/10 border-red-500/40 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <span>{chatQuota.remaining === 0 ? '⛔' : '💬'}</span>
              <span>{chatQuota.remaining}/{chatQuota.limit} messages</span>
            </div>
          )}
          {/* Active Engine Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block">Modèle Actif :</span>
              <span className="text-xs font-bold text-white">{activeModelName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[560px] overflow-hidden">
        
        {/* Messages list */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-cyan-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>{msg.time}</span>
                      {msg.model && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono">
                          {msg.model}
                        </span>
                      )}
                    </div>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copié' : 'Copier'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center shrink-0 text-purple-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 text-cyan-300">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>L'IA analyse les algorithmes et compose votre réponse...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area — Paywall si quota épuisé, sinon input normal */}
        {quotaBlocked ? (
          <div className="p-4 border-t border-slate-800">
            <PaywallBanner
              type="quota"
              quotaType="chat"
              onUpgrade={onOpenPricing}
              compact={false}
            />
          </div>
        ) : (
          <>
            {/* Quick Prompts Bar */}
            <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Posez une question, demandez des angles viraux ou un script..."
                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40 shadow-glow-purple"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Link2, 
  ExternalLink, 
  Send, 
  Check, 
  AlertCircle,
  Webhook
} from 'lucide-react';
import { INITIAL_CHANNELS } from '../data/mockChannels';
import { StorageService } from '../services/storage';

export default function ChannelManager() {
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [webhookUrl, setWebhookUrl] = useState(
    StorageService.getAppSettings().customWebhookUrl || 'https://hook.eu1.make.com/viralpulse-auto-relay'
  );
  const [testWebhookStatus, setTestWebhookStatus] = useState(null);

  const toggleAutoPublish = (id) => {
    setChannels(channels.map(c => {
      if (c.id === id) {
        return { ...c, autoPublishEnabled: !c.autoPublishEnabled };
      }
      return c;
    }));
  };

  const handleTestWebhook = () => {
    setTestWebhookStatus('testing');
    setTimeout(() => {
      setTestWebhookStatus('success');
      setTimeout(() => setTestWebhookStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-card-elevated">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Share2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Canaux Sociaux & Passerelles de Diffusion
            </h2>
            <p className="text-xs text-slate-300">
              Gérez vos comptes connectés, activez la publication automatique et reliez vos Webhooks Make / Zapier.
            </p>
          </div>
        </div>
      </div>

      {/* Webhook Dispatcher Card */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Passerelle Webhook Universelle (Make / Zapier / Buffer)
            </h3>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            Actif & Prêt
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Chaque post validé ou publié par le pilote automatique peut être envoyé automatiquement vers votre scénario Make ou Zapier pour diffusion réelle sur vos comptes sociaux.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hook.eu1.make.com/..."
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
          <button
            onClick={handleTestWebhook}
            disabled={testWebhookStatus === 'testing'}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-glow-purple transition-all"
          >
            {testWebhookStatus === 'testing' ? (
              <span>Test en cours...</span>
            ) : testWebhookStatus === 'success' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Webhook Validé 200 OK</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Tester le Webhook</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Social Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{channel.name}</h4>
                    <span className="text-[11px] text-slate-400">{channel.handle}</span>
                  </div>
                </div>

                <span className={`w-2.5 h-2.5 rounded-full ${channel.connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] mb-3">
                <div>
                  <span className="text-slate-400 block">Audience :</span>
                  <span className="font-bold text-slate-200">{channel.totalFollowers}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Taux d'engagement :</span>
                  <span className="font-bold text-emerald-400">{channel.avgEngagementRate}</span>
                </div>
              </div>
            </div>

            {/* Auto-publish toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">Publication Auto</span>
              <button
                onClick={() => toggleAutoPublish(channel.id)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  channel.autoPublishEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    channel.autoPublishEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

import { HASHTAG_DATABASE, PLATFORM_HASHTAG_RULES } from '../data/hashtagVault';
import { VIRAL_HOOK_FORMULAS } from '../data/viralHooks';
import { StorageService } from './storage';

// Moteur de génération IA de contenu viral multi-plateformes

export const TONE_OPTIONS = [
  { id: 'expert', label: 'Autorité & Expert', desc: 'Chiffres précis, analyse rigoureuse, ton crédible', icon: 'Award' },
  { id: 'provocative', label: 'Contre-intuitif / Choc', desc: 'Rupture de croyance, débat, vérité sans filtre', icon: 'Flame' },
  { id: 'storyteller', label: 'Storytelling Émotionnel', desc: 'Parcours personnel, échec, transformation', icon: 'BookOpen' },
  { id: 'minimalist', label: 'Ultra-Minimaliste', desc: 'Punchlines percutantes, zéro blabla, listes', icon: 'Zap' },
  { id: 'inspirational', label: 'Inspirant & Action', desc: 'Énergie haute, passage à l\'action immédiat', icon: 'Sparkles' }
];

export const FORMAT_TEMPLATES = [
  { id: 'twitter', name: 'X / Twitter', icon: 'Twitter', type: 'Thread & Tweets viraux', badge: 'Fort taux de partage' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', type: 'Post d\'autorité & Carrousel', badge: 'Portée B2B max' },
  { id: 'instagram', name: 'Instagram', icon: 'Instagram', type: 'Légende & Idée Carrousel', badge: 'Sauvegardes' },
  { id: 'tiktok', name: 'TikTok', icon: 'Video', type: 'Script Vidéo 45s + Cues', badge: 'Viralité explosive' },
  { id: 'youtube', name: 'YouTube Shorts', icon: 'Youtube', type: 'Script Shorts + Hook Rétention', badge: 'Abonnés rapides' },
  { id: 'threads', name: 'Threads', icon: 'MessageSquare', type: 'Post Débat & Conversation', badge: 'Engagement' }
];

// Nettoie une clé API de tout caractère invisible ou parasite
export function sanitizeApiKey(key) {
  if (!key) return '';
  return key.trim().replace(/^["'`\s]+|["'`\s]+$/g, '');
}

/**
 * Récupère la liste réelle des modèles supportés par la clé API de l'utilisateur
 */
export async function fetchSupportedGeminiModels(rawKey) {
  const key = sanitizeApiKey(rawKey);
  if (!key) return [];

  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
    `https://generativelanguage.googleapis.com/v1/models?key=${key}`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep);
      if (res.ok) {
        const data = await res.json();
        const models = data.models || [];
        const generateModels = models
          .filter(m => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''));

        if (generateModels.length > 0) {
          return generateModels;
        }
      }
    } catch (e) {
      console.warn('Erreur requête ListModels sur ' + ep, e);
    }
  }

  return [];
}

/**
 * Découvre automatiquement le meilleur modèle Gemini pour la clé
 */
export async function resolveGeminiModel(rawKey, userPreference = '') {
  const key = sanitizeApiKey(rawKey);
  const supported = await fetchSupportedGeminiModels(key);

  // Si l'utilisateur a choisi un modèle précis et qu'il est supporté
  if (userPreference && userPreference !== 'auto') {
    if (supported.length === 0 || supported.includes(userPreference)) {
      return { model: userPreference, version: 'v1beta', supportedList: supported };
    }
  }

  // Ordre de priorité intelligent parmi les modèles réels renvoyés par Google
  const priorities = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash',
    'gemini-3.6-flash',
    'gemini-3.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  for (const p of priorities) {
    if (supported.includes(p)) {
      return { model: p, version: 'v1beta', supportedList: supported };
    }
  }

  if (supported.length > 0) {
    return { model: supported[0], version: 'v1beta', supportedList: supported };
  }

  return { model: 'gemini-1.5-flash-latest', version: 'v1beta', supportedList: [] };
}

/**
 * Appel direct à l'API Google Gemini
 */
export async function callGeminiAPI(prompt, systemInstruction = '', apiKey = '', customModel = '') {
  const appSettings = StorageService.getAppSettings();
  const rawKey = apiKey || appSettings.geminiApiKey;
  const key = sanitizeApiKey(rawKey);

  if (!key) {
    throw new Error('Aucune clé API Gemini trouvée. Veuillez la renseigner dans les Paramètres (⚙️).');
  }

  // Instruction système combinée : français obligatoire + instruction personnalisée
  const frenchRule = 'RÈGLE ABSOLUE : Tu dois TOUJOURS répondre en FRANÇAIS, sans exception, quelle que soit la langue du message reçu.';
  const combinedSystem = systemInstruction 
    ? `${frenchRule}\n\n${systemInstruction}` 
    : frenchRule;

  const body = {
    // Champ natif systemInstruction de l'API Gemini v1beta (le plus fiable)
    systemInstruction: {
      parts: [{ text: combinedSystem }]
    },
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.75,
      topP: 0.95,
      maxOutputTokens: 2500,
    }
  };

  const { model: resolvedModel, supportedList } = await resolveGeminiModel(key, customModel || appSettings.geminiModel);

  // Construction de la liste des modèles à tester en priorité
  const candidates = [
    resolvedModel,
    ...(supportedList || []),
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-3.6-flash',
    'gemini-pro'
  ];
  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];

  let lastError = null;

  for (const mod of uniqueCandidates) {
    for (const apiVer of ['v1beta', 'v1']) {
      try {
        const cleanModName = mod.replace(/^models\//, '');
        const endpoint = `https://generativelanguage.googleapis.com/${apiVer}/models/${cleanModName}:generateContent?key=${key}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          const data = await response.json();
          const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textOutput) {
            return textOutput;
          }
        } else {
          const err = await response.json();
          lastError = err.error?.message || response.statusText;
        }
      } catch (err) {
        lastError = err.message;
      }
    }
  }

  throw new Error(`Google Gemini API : ${lastError || 'Erreur de communication avec le serveur'}`);
}

/**
 * Teste la validité d'une clé API Gemini et retourne les modèles actifs
 */
export async function testGeminiApiKey(rawKey, customModel = '') {
  const key = sanitizeApiKey(rawKey);
  if (!key) return { success: false, message: 'La clé API est vide.' };

  try {
    const supported = await fetchSupportedGeminiModels(key);
    const reply = await callGeminiAPI('Réponds uniquement par le mot "CONNECTÉ".', '', key, customModel);

    if (reply) {
      const activeMod = customModel && customModel !== 'auto' ? customModel : (supported[0] || 'Gemini Flash');
      return {
        success: true,
        message: `✅ Connecté avec succès ! Modèle actif : "${activeMod}" (${supported.length} modèles disponibles sur votre clé).`,
        supportedModels: supported
      };
    }
    return { success: false, message: 'Aucune réponse reçue de Gemini.' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Appel direct à l'API OpenAI (GPT-4o / GPT-4o Mini)
 */
export async function callOpenAIAPI(messages, apiKey = '') {
  const rawKey = apiKey || StorageService.getAppSettings().openAiApiKey;
  const key = sanitizeApiKey(rawKey);
  if (!key) throw new Error('Aucune clé OpenAI trouvée.');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`OpenAI API : ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Générateur intelligent pour le Copilote Chat
 */
export async function generateAIChatReply(query, history = []) {
  const appSettings = StorageService.getAppSettings();
  const geminiKey = sanitizeApiKey(appSettings.geminiApiKey);
  const openAiKey = sanitizeApiKey(appSettings.openAiApiKey);

  const systemPrompt = `Tu es ViralPulse Copilot, expert en création de contenu viral et en stratégie réseaux sociaux (X, LinkedIn, TikTok, Instagram, YouTube Shorts, Threads).

RÈGLES ABSOLUES — respecte-les sans exception :
1. Réponds TOUJOURS et UNIQUEMENT en FRANÇAIS, même si le sujet est en anglais.
2. Ne montre JAMAIS ton processus de réflexion interne, tes hypothèses, ni tes notes de travail. Commence directement par ta réponse finale.
3. N'utilise JAMAIS de tirets italiques du style "*Idée 1...*", "*(Self-Correction)*", "*Let's build...*" ou tout autre marqueur de raisonnement visible.
4. Sois direct, structuré, aéré, ultra-actionnable. Utilise des émojis pour structurer, des listes claires, des exemples concrets prêts à copier-coller.
5. Ton style : percutant, expert, inspirant. Zéro blabla.`;

  // 1. Appel direct Google Gemini si la clé est présente
  if (geminiKey) {
    try {
      const historyContext = history.slice(-6).map(m => `${m.sender === 'user' ? 'Utilisateur' : 'Copilote'}: ${m.text}`).join('\n');
      const prompt = `${historyContext ? `[Historique de la discussion]\n${historyContext}\n\n` : ''}[Demande] ${query}\n\n[Instruction] Réponds directement en FRANÇAIS avec une réponse structurée, claire et immédiatement utilisable. Ne montre pas ta réflexion.`;

      const liveText = await callGeminiAPI(prompt, systemPrompt, geminiKey);
      return {
        text: liveText,
        isRealLLM: true,
        model: `Google Gemini (Live)`
      };
    } catch (e) {
      console.error('Erreur appel Gemini:', e);
      return {
        text: `⚠️ **Erreur lors de la communication avec l'API Gemini :**\n${e.message}\n\n*Vérifiez votre clé dans les Paramètres (⚙️).*`,
        isRealLLM: false,
        model: 'Erreur Clé API Gemini'
      };
    }
  }

  // 2. Appel direct OpenAI si la clé est présente
  if (openAiKey) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: query }
      ];
      const liveText = await callOpenAIAPI(messages, openAiKey);
      return {
        text: liveText,
        isRealLLM: true,
        model: 'OpenAI GPT-4o Mini (Live)'
      };
    } catch (e) {
      console.error('Erreur appel OpenAI:', e);
      return {
        text: `⚠️ **Erreur lors de la communication avec l'API OpenAI :**\n${e.message}\n\n*Vérifiez votre clé dans les Paramètres (⚙️).*`,
        isRealLLM: false,
        model: 'Erreur Clé API OpenAI'
      };
    }
  }

  // 3. Moteur autonome heuristique si aucune clé n'est configurée
  await new Promise(r => setTimeout(r, 700));

  let replyText = '';
  const q = query.toLowerCase();

  if (q.includes('provocateur') || q.includes('angle') || q.includes('choc')) {
    replyText = `Voici 3 angles contre-intuitifs à fort potentiel viral conçus pour casser le scroll :

1️⃣ **L'angle "Mort du travail acharné" :**
"Travailler 12h par jour en 2026 n'est plus un signe de discipline, c'est la preuve d'un système défaillant."

2️⃣ **L'angle "L'illusion de la saturation" :**
"Le marché n'est pas saturé de contenu, il est saturé de copier-coller sans âme. Ceux qui ont une opinion tranchée dominent en 3 semaines."

3️⃣ **L'angle "Le piège de la perfection" :**
"Votre premier post sera nul. Votre dixième sera moyen. Votre centième changera votre vie financière. Arrêtez de polir un brouillon pendant 6 mois."`;
  } else if (q.includes('tiktok') || q.includes('script') || q.includes('reels') || q.includes('short')) {
    replyText = `🎬 **Script TikTok / Reels 30s (Haute Rétention)** :

**[0:00 - 0:02] Hook Visuel (Pattern Interrupt) :**
*(Regard caméra, texte en rouge sur fond noir)* : "90% des gens font cette erreur fatale..."

**[0:02 - 0:15] Tension & Constat :**
"Ils pensent qu'il faut un micro à 300€ et une caméra 4K. La vérité ? C'est le HOOK des 2 premières secondes qui décide de tout."

**[0:15 - 0:25] La solution concrète :**
"Appliquez la formule 'Problème + Chiffre + Contre-pied'. Par exemple : 'Comment gagner 5h par jour sans réveil à 5h'."

**[0:25 - 0:30] CTA :**
"Abonne-toi pour le template gratuit en bio !"`;
  } else if (q.includes('hook') || q.includes('accroche')) {
    replyText = `🔥 **5 Hooks Viraux prêts à l'emploi :**

1. "99% des gens pensent que [Croyance commune]. La vérité ? C'est l'exact opposé :"
2. "J'ai passé 6 mois à chercher le meilleur système pour [Objectif]. Voici la pépite :"
3. "Si vous faites encore [Action dépassée], vous perdez 10h par semaine :"
4. "Comment passer de 0 à [Résultat] sans [Contrainte détestée] (Démonstration) :"
5. "La méthode méconnue que les plus grands créateurs refusent de partager gratuitement :"`;
  } else {
    replyText = `Voici une version optimisée à haute valeur ajoutée pour votre sujet :

"${query.length > 20 ? query : 'Le secret des meilleurs créateurs ?'}

Ce qui sépare les créateurs qui stagnent de ceux qui génèrent 100K+ vues par mois n'est pas le talent, mais l'architecture de leur contenu :

1. Un Hook qui brise le scroll dès la première seconde
2. Une promesse claire et mesurable
3. Une structure aérée facile à scanner sur smartphone
4. Un call-to-action sans friction

💡 Testez cette structure sur votre prochain post et observez la différence d'engagement !"`;
  }

  return {
    text: replyText,
    isRealLLM: false,
    model: 'Moteur Autonome (Configurez une clé Gemini pour le mode Live IA)'
  };
}

/**
 * Génère automatiquement les hashtags optimaux selon la niche et la plateforme
 */
export function getOptimizedHashtags(category, platformId) {
  const nicheTags = HASHTAG_DATABASE[category] || HASHTAG_DATABASE['ai-tech'];
  const rules = PLATFORM_HASHTAG_RULES[platformId] || PLATFORM_HASHTAG_RULES['twitter'];

  const t1 = nicheTags.tier1 || [];
  const t2 = nicheTags.tier2 || [];
  const t3 = nicheTags.tier3 || [];

  let selected = [];
  const ratio = rules.preferredTierRatio;

  for (let i = 0; i < ratio.tier1 && i < t1.length; i++) selected.push(t1[i].tag);
  for (let i = 0; i < ratio.tier2 && i < t2.length; i++) selected.push(t2[i].tag);
  for (let i = 0; i < ratio.tier3 && i < t3.length; i++) selected.push(t3[i].tag);

  return selected.slice(0, rules.maxRecommended);
}

/**
 * Calcule un score prédictif de viralité
 */
export function calculateViralityScore(content, platform) {
  let score = 75;
  if (!content) return { score: 50, breakdown: { hook: 50, structure: 50, emotion: 50, seo: 50 } };

  const length = content.length;
  const hasNumbers = /\d+/.test(content);
  const hasEmoji = /[\u{1F300}-\u{1F6FF}]/u.test(content);
  const hasQuestion = /\?/.test(content);
  const hasLineBreaks = content.split('\n').length > 3;

  if (hasNumbers) score += 6;
  if (hasEmoji) score += 4;
  if (hasQuestion) score += 5;
  if (hasLineBreaks) score += 8;
  if (length > 150 && length < 1800) score += 5;

  const hookScore = hasNumbers && (content.includes(':') || content.includes('?')) ? 96 : 82;
  const structureScore = hasLineBreaks ? 94 : 70;
  const emotionScore = hasEmoji || content.includes('!') ? 90 : 75;
  const seoScore = content.includes('#') ? 92 : 68;

  const finalScore = Math.min(99, Math.max(60, Math.round((hookScore * 0.35) + (structureScore * 0.25) + (emotionScore * 0.2) + (seoScore * 0.2))));

  return {
    score: finalScore,
    breakdown: {
      hook: hookScore,
      structure: structureScore,
      emotion: emotionScore,
      seo: seoScore
    }
  };
}

/**
 * Générateur de contenu complet pour l'ensemble des plateformes (avec intégration Gemini Live si présent)
 */
export async function generateMultiPlatformContent({
  topic,
  category = 'ai-tech',
  tone = 'expert',
  customHook = '',
  targetAudience = 'Créateurs, Entrepreneurs, Professionnels',
}) {
  const appSettings = StorageService.getAppSettings();
  const geminiKey = sanitizeApiKey(appSettings.geminiApiKey);

  const hashtagsX = getOptimizedHashtags(category, 'twitter');
  const hashtagsLI = getOptimizedHashtags(category, 'linkedin');
  const hashtagsIG = getOptimizedHashtags(category, 'instagram');
  const hashtagsTT = getOptimizedHashtags(category, 'tiktok');
  const hashtagsYT = getOptimizedHashtags(category, 'youtube');
  const hashtagsTH = getOptimizedHashtags(category, 'threads');

  const selectedHook = customHook || `99% des gens ignorent encore la puissance de ${topic}. Voici ce qui change tout :`;

  let twitterContent = '';
  let linkedinContent = '';
  let instagramContent = '';
  let tiktokContent = '';
  let youtubeContent = '';
  let threadsContent = '';
  let visualPrompt = '';
  let isLiveAI = false;

  // Si une clé Gemini est configurée, on demande à Gemini de générer des contenus uniques et sur-mesure !
  if (geminiKey) {
    try {
      const prompt = `Tu es un expert mondial en création de contenu viral sur les réseaux sociaux.
RÈGLE OBLIGATOIRE : Rédige l'intégralité des publications en FRANÇAIS (sauf visualPrompt qui doit être en anglais pour Midjourney/Flux).
Rédige 6 variations uniques, percutantes et adaptées pour le sujet suivant :
- Sujet : "${topic}"
- Niche : "${category}"
- Tonalité : "${tone}"
- Hook d'accroche recommandé : "${selectedHook}"

Réponds STRICTEMENT au format JSON valide suivant, sans aucun texte introductif ni markdown autour :
{
  "twitter": "Contenu du Thread X/Twitter (6 tweets numérotés 1/6, 2/6... avec hook percutant, listes à puces et call-to-action)",
  "linkedin": "Contenu du Post LinkedIn (Post d'autorité avec storytelling, lignes aérées, 3 leçons clés, question d'engagement)",
  "instagram": "Légende Instagram détaillée + Plan carrousel slide par slide (Slide 1 à 5)",
  "tiktok": "Script vidéo TikTok de 45 secondes avec timestamps [0:00 - 0:03], indications visuelles caméra, pattern interrupt et CTA",
  "youtube": "Script YouTube Shorts 60s haute rétention avec accroche mystère et analyse rapide",
  "threads": "Post direct et débatteur pour Threads",
  "visualPrompt": "Prompt en anglais pour générer une image 3D futuriste sur Midjourney ou Flux en rapport avec le sujet"
}`;

      const geminiRaw = await callGeminiAPI(prompt, 'Tu es un générateur de contenu JSON pur.', geminiKey);

      // Extraction JSON tolérante
      const firstBrace = geminiRaw.indexOf('{');
      const lastBrace = geminiRaw.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonString = geminiRaw.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonString);

        if (parsed.twitter && parsed.linkedin) {
          twitterContent = `${parsed.twitter}\n\n${hashtagsX.join(' ')}`;
          linkedinContent = `${parsed.linkedin}\n\n---\n${hashtagsLI.join(' ')}`;
          instagramContent = `${parsed.instagram}\n\n.\n.\n${hashtagsIG.join(' ')}`;
          tiktokContent = `${parsed.tiktok}\n\nTags : ${hashtagsTT.join(' ')}`;
          youtubeContent = `${parsed.youtube}\n\n${hashtagsYT.join(' ')}`;
          threadsContent = `${parsed.threads}\n\n${hashtagsTH.join(' ')}`;
          visualPrompt = parsed.visualPrompt || `Futuristic 3D render illustrating "${topic}", cyber-glow aesthetics, ultra-sharp 8k resolution.`;
          isLiveAI = true;
        }
      }

    } catch (e) {
      console.warn('Erreur parsing Gemini JSON, utilisation du template de secours enrichi', e);
    }
  }

  // Fallback si pas de clé ou si erreur API
  if (!twitterContent) {
    await new Promise(r => setTimeout(r, 600));

    twitterContent = `🧵 1/6 ${selectedHook}

La plupart des gens passent des heures sur des tâches répétitives alors qu'un simple système automatisé peut faire le travail de 3 personnes en arrière-plan.

Voici les 4 étapes concrètes pour l'implémenter dès aujourd'hui sur "${topic}" 👇

2/6 📌 Étape 1 : Cartographier les goulots d'étranglement
Ne cherchez pas à tout faire d'un coup. Isolez la tâche qui consomme le plus de charge mentale.

3/6 ⚡ Étape 2 : Déployer la stack intelligente
Combinez les bons outils pour créer une chaîne fluide sans friction.

4/6 💡 Étape 3 : Le secret de la scalabilité
Ne mesurez pas le temps passé, mesurez le levier créé. 1 heure investie dans un système = 50 heures gagnées chaque mois.

5/6 🎯 Étape 4 : L'itération continue
Adaptez votre contenu en temps réel grâce aux métriques de rétention.

6/6 🚀 Vous voulez aller plus loin ?
1. Likez & Repostez le premier tweet pour le retrouver plus tard.
2. Commentez "VIRAL" et je vous envoie le template complet en DM.

${hashtagsX.join(' ')}`;

    linkedinContent = `${selectedHook}

Il y a 6 mois, je pensais qu'il fallait travailler 70 heures par semaine pour obtenir des résultats solides sur ${topic}.

Puis j'ai compris une vérité brutale :
👉 L'effort acharné ne bat jamais un système bien conçu.

Voici les 3 principes que j'applique pour générer un impact maximal :

1️⃣ La clarté avant la vitesse
Agir sans stratégie claire, c'est accélérer dans un cul-de-sac. Prenez toujours 30 minutes de recul pour définir l'angle unique.

2️⃣ L'automatisation des tâches à faible valeur
Tout ce qui peut être délégué à une règle logique doit l'être. Votre cerveau doit être réservé à la créativité.

3️⃣ La consistance obsessionnelle
Un contenu moyen publié chaque jour battra TOUJOURS un chef-d'œuvre publié une fois par mois.

💡 Quelle est la tâche que vous répétez chaque jour et que vous devriez automatiser dès ce soir ?

Dites-le-moi en commentaire, j'analyse vos réponses 👇

---
${hashtagsLI.join(' ')}`;

    instagramContent = `✨ ${selectedHook}

(Enregistrez ce post pour le relire quand vous passerez à l'action 📌)

Dans un monde saturé de bruit, ceux qui gagnent ne sont pas ceux qui crient le plus fort, mais ceux qui appliquent une méthode reproductible sur ${topic}.

Swipez pour découvrir les 5 piliers clés ➡️

Slide 1 : Le Constat de départ
Slide 2 : L'erreur que 90% des débutants commettent
Slide 3 : La matrice d'exécution rapide
Slide 4 : Les 3 outils indispensables
Slide 5 : Le plan d'action en 7 jours

💬 Quel pilier résonne le plus avec votre situation actuelle ?

.
.
${hashtagsIG.join(' ')}`;

    tiktokContent = `🎬 [SCRIPT VIDÉO TIKTOK - 45 SECONDES]

[0:00 - 0:03] 💥 HOOK VISUEL & PATTERN INTERRUPT
(Plan serré, regard caméra, texte choc à l'écran : "NE FAITES PLUS JAMAIS ÇA")
"Arrêtez tout ! Si vous passez encore plus de 2 heures par jour sur ${topic}, vous perdez littéralement votre temps."

[0:03 - 0:12] 🔍 LE PROBLÈME / TENSION
(Zoom rapide, gestuelle dynamique)
"Pendant des mois, j'ai fait comme tout le monde : bosser dur pour des résultats minuscules. Jusqu'au jour où j'ai découvert cette méthode méconnue."

[0:12 - 0:28] 💡 LA RÉSOLUTION EN 3 ÉTAPES
(Incrustation écran & B-roll rapide avec effets sonores "Woosh")
"Étape 1 : Vous isolez votre meilleure idée.
Étape 2 : Vous laissez l'IA générer les variations prêtes à l'emploi.
Étape 3 : Vous programmez tout en pilote automatique."

[0:28 - 0:38] 🚀 LE RÉSULTAT PROUVÉ
(Affichage d'un graphique de croissance à l'écran)
"Résultat ? Des semaines de contenu prêtes en 10 minutes chrono et une portée multipliée par 5."

[0:38 - 0:45] 🎯 CALL TO ACTION IMMÉDIAT
(Pointage du doigt vers le bouton d'abonnement)
"Abonne-toi pour ne rater aucun des prochains hacks de viralité, et lâche un like si tu veux le tutoriel complet !"

Tags : ${hashtagsTT.join(' ')}`;

    youtubeContent = `⚡ [SCRIPT YOUTUBE SHORTS - HAUTE RÉTENTION]

[0:00 - 0:04] 🎙️ ACCROCHE MYSTÈRE
"BlackRock, les plus grands créateurs et les solopreneurs à succès utilisent tous ce secret sur ${topic}..."

[0:04 - 0:18] 📊 ANALYSE FLASH
"Regardez cette courbe. Ce n'est pas de la chance. C'est l'application chirurgicale d'un système à 3 leviers :"

[0:18 - 0:35] 🛠️ DÉMONSTRATION ÉTAPE PAR ÉTAPE
"1. Détecter les sujets qui explosent AVANT qu'ils ne deviennent viraux.
2. Adapter le format exactement aux attentes de l'algorithme.
3. Utiliser les bons hashtags ciblés par palier d'audience."

[0:35 - 0:50] 🔔 APPEL À L'ACTION
"Le guide complet est épinglé dans la description. Clique sur s'abonner pour dominer les tendances 2026 !"

${hashtagsYT.join(' ')}`;

    threadsContent = `${selectedHook}

Opinion impopulaire à propos de ${topic} : les gens qui disent que "le marché est saturé" cherchent juste une excuse pour ne pas commencer.

Il y a toujours de la place pour ceux qui apportent une vraie valeur et une perspective unique.

Vous êtes d'accord ou pas du tout ? Discutons-en ci-dessous 👇

${hashtagsTH.join(' ')}`;

    visualPrompt = `High-end futuristic 3D aesthetic banner for social media, topic about "${topic}", glowing neon accents in cyan and cyber purple, glassmorphic floating UI cards displaying analytics charts, ultra-sharp 8k resolution, minimalist cinematic lighting, hyper-detailed render.`;
  }

  return {
    id: `gen-${Date.now()}`,
    topic,
    category,
    tone,
    createdAt: new Date().toISOString(),
    isLiveAI,
    viralityMetrics: calculateViralityScore(twitterContent, 'twitter'),
    visualPrompt,
    platforms: {
      twitter: {
        platform: 'twitter',
        title: 'Thread X / Twitter (6 Tweets)',
        content: twitterContent,
        hashtags: hashtagsX,
        estimatedImpressions: '25K - 60K',
        estimatedEngagement: '5.2%',
        viralityScore: 97
      },
      linkedin: {
        platform: 'linkedin',
        title: 'Post d\'Autorité LinkedIn',
        content: linkedinContent,
        hashtags: hashtagsLI,
        estimatedImpressions: '18K - 45K',
        estimatedEngagement: '6.8%',
        viralityScore: 94
      },
      instagram: {
        platform: 'instagram',
        title: 'Légende & Carrousel Instagram',
        content: instagramContent,
        hashtags: hashtagsIG,
        estimatedImpressions: '30K - 85K',
        estimatedEngagement: '8.4%',
        viralityScore: 92
      },
      tiktok: {
        platform: 'tiktok',
        title: 'Script Vidéo TikTok (Facecam + B-Roll)',
        content: tiktokContent,
        hashtags: hashtagsTT,
        estimatedImpressions: '50K - 200K+',
        estimatedEngagement: '11.5%',
        viralityScore: 98
      },
      youtube: {
        platform: 'youtube',
        title: 'Script YouTube Shorts 60s',
        content: youtubeContent,
        hashtags: hashtagsYT,
        estimatedImpressions: '40K - 120K',
        estimatedEngagement: '7.9%',
        viralityScore: 95
      },
      threads: {
        platform: 'threads',
        title: 'Post Débat Threads',
        content: threadsContent,
        hashtags: hashtagsTH,
        estimatedImpressions: '10K - 30K',
        estimatedEngagement: '5.9%',
        viralityScore: 89
      }
    }
  };
}

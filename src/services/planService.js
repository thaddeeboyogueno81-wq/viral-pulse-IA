/**
 * PlanService — Gestion des plans, quotas journaliers et licences
 * ViralPulse AI SaaS Freemium
 */

const STORAGE_KEYS = {
  PLAN: 'viralpulse_plan',           // 'free' | 'pro' | 'business'
  QUOTA_DATE: 'viralpulse_quota_date',
  QUOTA_GENERATIONS: 'viralpulse_quota_gen',
  QUOTA_CHAT: 'viralpulse_quota_chat',
  QUOTA_HASHTAG: 'viralpulse_quota_hashtag',
  LICENSE_KEY: 'viralpulse_license',
  PLAN_EXPIRES: 'viralpulse_plan_expires',
};

// ─── Limites par plan ────────────────────────────────────────────────
export const PLAN_LIMITS = {
  free: {
    label: 'Gratuit',
    color: 'slate',
    badge: 'FREE',
    generations: 3,         // générations IA par jour
    chatMessages: 5,        // messages copilote par jour
    hashtagNiches: 1,       // niches hashtag par jour
    platforms: ['twitter', 'linkedin'],  // plateformes débloquées
    autopilot: false,
    downloadContent: false,
    channels: 1,
    viralityAdvanced: false,
  },
  pro: {
    label: 'Pro',
    color: 'indigo',
    badge: 'PRO',
    generations: 30,
    chatMessages: Infinity,
    hashtagNiches: Infinity,
    platforms: ['twitter', 'linkedin', 'instagram', 'tiktok', 'youtube', 'threads'],
    autopilot: true,
    downloadContent: true,
    channels: 3,
    viralityAdvanced: true,
  },
  business: {
    label: 'Business',
    color: 'emerald',
    badge: 'BIZ',
    generations: Infinity,
    chatMessages: Infinity,
    hashtagNiches: Infinity,
    platforms: ['twitter', 'linkedin', 'instagram', 'tiktok', 'youtube', 'threads'],
    autopilot: true,
    downloadContent: true,
    channels: Infinity,
    viralityAdvanced: true,
  },
};

// ─── Plans tarifaires ─────────────────────────────────────────────────
export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    priceLabel: '0€',
    period: '',
    description: 'Découvrez ViralPulse AI sans engagement',
    highlight: false,
    stripeLink: null,
    features: [
      '3 générations IA par jour',
      'X (Twitter) & LinkedIn uniquement',
      '5 messages Copilote / jour',
      '1 niche Hashtag / jour',
      'Niche Radar (lecture seule)',
    ],
    locked: [
      'TikTok, Instagram, Shorts, Threads',
      'Pilote Automatique',
      'Téléchargement des contenus',
      'Analyse de viralité avancée',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    priceLabel: '9,99€',
    period: '/ mois',
    description: 'Toutes les plateformes, générations illimitées',
    highlight: true,
    badge: '🔥 Populaire',
    stripeLink: 'https://buy.stripe.com/test_viralpulse_pro',  // Remplacez par votre vrai lien Stripe
    features: [
      '30 générations IA par jour',
      'Toutes les plateformes (6)',
      'Chat Copilote illimité',
      'Hashtag Optimizer illimité',
      'Pilote Automatique complet',
      'Téléchargement des contenus',
      'Analyse de viralité avancée',
      '3 canaux réseaux sociaux',
      'Support par email',
    ],
    locked: [],
  },
  {
    id: 'business',
    name: 'Business',
    price: 29.99,
    priceLabel: '29,99€',
    period: '/ mois',
    description: 'Illimité, multi-comptes et webhooks',
    highlight: false,
    badge: '🚀 Best ROI',
    stripeLink: 'https://buy.stripe.com/test_viralpulse_business',  // Remplacez par votre vrai lien Stripe
    features: [
      'Générations IA illimitées',
      'Toutes les plateformes (6)',
      'Chat Copilote illimité',
      'Pilote Automatique + Webhooks',
      'Canaux illimités',
      'Recommandations IA personnalisées',
      'Support prioritaire',
      'API Access (bientôt)',
    ],
    locked: [],
  },
];

// ─── Helpers internes ─────────────────────────────────────────────────
function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function resetIfNewDay() {
  const savedDate = localStorage.getItem(STORAGE_KEYS.QUOTA_DATE);
  const today = getTodayKey();
  if (savedDate !== today) {
    localStorage.setItem(STORAGE_KEYS.QUOTA_DATE, today);
    localStorage.setItem(STORAGE_KEYS.QUOTA_GENERATIONS, '0');
    localStorage.setItem(STORAGE_KEYS.QUOTA_CHAT, '0');
    localStorage.setItem(STORAGE_KEYS.QUOTA_HASHTAG, '0');
  }
}

// ─── API Publique ─────────────────────────────────────────────────────

/**
 * Retourne le plan actif de l'utilisateur
 * @returns {'free'|'pro'|'business'}
 */
export function getCurrentPlan() {
  const plan = localStorage.getItem(STORAGE_KEYS.PLAN) || 'free';
  // Vérification expiration
  const expires = localStorage.getItem(STORAGE_KEYS.PLAN_EXPIRES);
  if (expires && new Date(expires) < new Date()) {
    localStorage.setItem(STORAGE_KEYS.PLAN, 'free');
    localStorage.removeItem(STORAGE_KEYS.PLAN_EXPIRES);
    return 'free';
  }
  return plan;
}

/**
 * Retourne les limites du plan actif
 */
export function getCurrentPlanLimits() {
  return PLAN_LIMITS[getCurrentPlan()];
}

/**
 * Vérifie si l'utilisateur peut accéder à une feature
 * @param {'autopilot'|'downloadContent'|'viralityAdvanced'} feature
 */
export function canAccess(feature) {
  const limits = getCurrentPlanLimits();
  return !!limits[feature];
}

/**
 * Vérifie si une plateforme est débloquée
 * @param {string} platformId
 */
export function isPlatformUnlocked(platformId) {
  return getCurrentPlanLimits().platforms.includes(platformId);
}

/**
 * Retourne le quota restant pour un type de quota
 * @param {'generations'|'chat'|'hashtag'} type
 * @returns {{ used: number, limit: number, remaining: number, isUnlimited: boolean }}
 */
export function getQuota(type) {
  resetIfNewDay();
  const plan = getCurrentPlan();
  const limits = PLAN_LIMITS[plan];

  const keyMap = {
    generations: STORAGE_KEYS.QUOTA_GENERATIONS,
    chat: STORAGE_KEYS.QUOTA_CHAT,
    hashtag: STORAGE_KEYS.QUOTA_HASHTAG,
  };

  const limitMap = {
    generations: limits.generations,
    chat: limits.chatMessages,
    hashtag: limits.hashtagNiches,
  };

  const used = parseInt(localStorage.getItem(keyMap[type]) || '0', 10);
  const limit = limitMap[type];
  const isUnlimited = limit === Infinity;

  return {
    used,
    limit: isUnlimited ? '∞' : limit,
    remaining: isUnlimited ? Infinity : Math.max(0, limit - used),
    isUnlimited,
    canUse: isUnlimited || used < limit,
  };
}

/**
 * Consomme 1 unité de quota. Retourne false si dépassé.
 * @param {'generations'|'chat'|'hashtag'} type
 */
export function consumeQuota(type) {
  resetIfNewDay();
  const quota = getQuota(type);
  if (!quota.canUse) return false;

  const keyMap = {
    generations: STORAGE_KEYS.QUOTA_GENERATIONS,
    chat: STORAGE_KEYS.QUOTA_CHAT,
    hashtag: STORAGE_KEYS.QUOTA_HASHTAG,
  };

  localStorage.setItem(keyMap[type], String(quota.used + 1));
  return true;
}

/**
 * Active un plan via une clé de licence
 * Format clé : VPAI-{PLAN}-{RANDOM8}  ex: VPAI-PRO-A1B2C3D4
 * @param {string} rawKey
 * @returns {{ success: boolean, plan?: string, message: string }}
 */
export function activateLicense(rawKey) {
  const key = (rawKey || '').trim().toUpperCase();
  if (!key.startsWith('VPAI-')) {
    return { success: false, message: 'Clé invalide. Format attendu : VPAI-PRO-XXXXXXXX' };
  }

  const parts = key.split('-');
  if (parts.length < 3) {
    return { success: false, message: 'Clé invalide ou incomplète.' };
  }

  const planPart = parts[1].toLowerCase();
  const planMap = { pro: 'pro', business: 'business', biz: 'business' };
  const plan = planMap[planPart];

  if (!plan) {
    return { success: false, message: `Plan inconnu dans la clé : "${parts[1]}". Valeurs valides : PRO, BIZ.` };
  }

  // Sauvegarde
  localStorage.setItem(STORAGE_KEYS.PLAN, plan);
  localStorage.setItem(STORAGE_KEYS.LICENSE_KEY, key);
  // Expiration 1 an (simulée)
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  localStorage.setItem(STORAGE_KEYS.PLAN_EXPIRES, expires.toISOString());

  return {
    success: true,
    plan,
    message: `✅ Plan ${PLAN_LIMITS[plan].label} activé avec succès ! Bienvenue dans ViralPulse ${PLAN_LIMITS[plan].label} 🎉`,
  };
}

/**
 * Génère une clé de démo (pour tester sans Stripe)
 */
export function generateDemoKey(plan = 'pro') {
  const planCode = plan === 'business' ? 'BIZ' : 'PRO';
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `VPAI-${planCode}-${random}`;
}

/**
 * Dégrade l'utilisateur au plan Free
 */
export function downgradeToFree() {
  localStorage.setItem(STORAGE_KEYS.PLAN, 'free');
  localStorage.removeItem(STORAGE_KEYS.LICENSE_KEY);
  localStorage.removeItem(STORAGE_KEYS.PLAN_EXPIRES);
}

/**
 * Retourne la clé de licence active (pour affichage)
 */
export function getLicenseKey() {
  return localStorage.getItem(STORAGE_KEYS.LICENSE_KEY) || null;
}

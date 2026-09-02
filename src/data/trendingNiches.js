// Base de données en temps réel des niches et tendances explosives
export const TRENDING_CATEGORIES = [
  { id: 'all', label: 'Toutes les Niches', icon: 'Sparkles' },
  { id: 'ai-tech', label: 'IA & Agents Autonomes', icon: 'Cpu' },
  { id: 'solopreneur', label: 'Solopreneuriat & SaaS', icon: 'Rocket' },
  { id: 'finance-crypto', label: 'Finance & Crypto 2.0', icon: 'TrendingUp' },
  { id: 'productivity', label: 'Biohacking & Productivité', icon: 'Zap' },
  { id: 'creator-growth', label: 'Creator Economy & Viralité', icon: 'Flame' },
  { id: 'ecommerce', label: 'E-commerce & Brands DTC', icon: 'ShoppingBag' },
  { id: 'mindset', label: 'Mindset & Carrière', icon: 'Brain' },
];

export const TRENDING_NICHES = [
  {
    id: 'niche-1',
    category: 'ai-tech',
    title: 'Agents IA Autonomes & Workflows No-Code',
    subtitle: 'Remplacer une équipe entière grâce aux agents IA connectés (LangGraph, AutoGPT, Make)',
    viralityScore: 98,
    growthRate: '+340%',
    competition: 'Moyenne (Océan Bleu)',
    searchVolume: '850K / mois',
    saturationIndex: 28, // 0-100 (plus bas = plus d'opportunité)
    bestPlatforms: ['X / Twitter', 'LinkedIn', 'YouTube Shorts'],
    optimalFormat: 'Thread comparatif + Script Démo Écran',
    trendingKeywords: ['Agents IA', 'Make AI', 'Workflow Automation', 'Prompt Chaining', 'Solopreneur 1M$'],
    recommendedHooks: [
      "99% des gens utilisent ChatGPT comme un simple chatbot. Voici comment créer un employé IA autonome en 15 minutes :",
      "Cette stack de 3 agents IA me fait économiser 40 heures par semaine (sans coder une seule ligne) :",
      "L'ère des SaaS traditionnels est morte. Les Micro-Agents IA autonomes prennent le relais. Voici pourquoi :"
    ],
    nicheSummary: 'Les audiences raffolent des cas concrets d\'automatisation rentable. Les posts étape par étape avec chiffres génèrent un taux de sauvegarde record.',
    topAudience: 'Solopreneurs, Devs, Marketeurs B2B, Créateurs',
    monetizationPotential: 'Très Élevé (Affiliation, Templates, Agence Automation)'
  },
  {
    id: 'niche-2',
    category: 'solopreneur',
    title: 'Micro-SaaS & Business "One-Person" à 10k€/mois',
    subtitle: 'Lancer et scaler un business rentable seul grâce aux outils modernes et au build-in-public',
    viralityScore: 94,
    growthRate: '+215%',
    competition: 'Modérée',
    searchVolume: '620K / mois',
    saturationIndex: 42,
    bestPlatforms: ['X / Twitter', 'LinkedIn', 'Instagram'],
    optimalFormat: 'Post Carrousel Storytelling + Chiffres Transparents',
    trendingKeywords: ['Build in Public', 'Micro SaaS', 'MRR', 'Solopreneur', 'Indie Hacker', 'Bootstrapping'],
    recommendedHooks: [
      "Comment j'ai généré mes premiers 10 000€ en solo avec un outil qui m'a coûté 0€ à concevoir :",
      "Vous n'avez pas besoin de lever 1 million. Vous avez juste besoin de 100 clients fidèles à 50€/mois. Démonstration :",
      "7 règles brutales que j'aurais aimé connaître avant de quitter mon CDI pour devenir solopreneur :"
    ],
    nicheSummary: 'Très forte identification émotionnelle. Les parcours personnels avec échecs, leçons et captures de revenus captivent instantanément.',
    topAudience: 'Employés en reconversion, Freelances, Développeurs',
    monetizationPotential: 'Élevé (Formations, Micro-logiciels, Communautés payantes)'
  },
  {
    id: 'niche-3',
    category: 'creator-growth',
    title: 'Short-Form Content & Algorithmes TikTok / Reels',
    subtitle: 'Dominer la rétention vidéo de 0 à 3 secondes et convertir les vues en communauté engagée',
    viralityScore: 96,
    growthRate: '+290%',
    competition: 'Élevée mais forte prime à l\'originalité',
    searchVolume: '1.2M / mois',
    saturationIndex: 55,
    bestPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    optimalFormat: 'Vidéo Facecam + B-Roll dynamique + Hook de rupture de pattern',
    trendingKeywords: ['Viral Hooks', 'Algorithme TikTok 2026', 'Watch Time', 'Rétention 100%', 'UGC Video'],
    recommendedHooks: [
      "Arrêtez de poster des vidéos sans appliquer cette règle des 1.5 premières secondes :",
      "L'algorithme TikTok a complètement changé cette semaine. Voici ce qui déclenche le million de vues maintenant :",
      "Le script exact en 5 étapes que j'utilise pour transformer n'importe quel sujet ennuyeux en vidéo virale :"
    ],
    nicheSummary: 'Les créateurs recherchent constamment des frameworks réplicables et des secrets d\'algorithmes prouvés.',
    topAudience: 'Créateurs de contenu, Marques D2C, Coachs',
    monetizationPotential: 'Élevé (Sponsoring, Coaching, Consulting)'
  },
  {
    id: 'niche-4',
    category: 'productivity',
    title: 'Dopamine Detox & Sommeil / Biohacking Cognitif',
    subtitle: 'Optimiser sa clarté mentale, son énergie et son focus dans un monde de micro-distractions',
    viralityScore: 91,
    growthRate: '+180%',
    competition: 'Faible à Moyenne',
    searchVolume: '490K / mois',
    saturationIndex: 34,
    bestPlatforms: ['Instagram', 'YouTube Shorts', 'LinkedIn'],
    optimalFormat: 'Infographies épurées & Récits de transformation',
    trendingKeywords: ['Neuroplasticité', 'Dopamine Reset', 'Deep Work', 'Sommeil Profond', 'Huberman Protocol'],
    recommendedHooks: [
      "Votre cerveau n'est pas fatigué, il est sur-stimulé. Voici le protocole de 72h pour réinitialiser vos récepteurs de dopamine :",
      "J'ai testé les 5 habitudes du matin des neuroscientifiques pendant 30 jours. Voici ce qui a vraiment changé :",
      "Si vous avez du mal à vous concentrer plus de 20 minutes, appliquez cette technique méconnue des moines zen :"
    ],
    nicheSummary: 'Les gens souffrent de surcharge mentale. Les solutions concrètes avec base scientifique génèrent d\'immenses partages.',
    topAudience: 'Professionnels débordés, Étudiants, Dirigeants',
    monetizationPotential: 'Moyen à Élevé (Suppléments, Newsletters santé, Apps)'
  },
  {
    id: 'niche-5',
    category: 'finance-crypto',
    title: 'RWA (Real World Assets) & Tokenisation 2026',
    subtitle: 'La convergence entre finance traditionnelle, immobilier fractionné et protocoles décentralisés',
    viralityScore: 89,
    growthRate: '+260%',
    competition: 'Faible (Niche technique sous-exploitée)',
    searchVolume: '380K / mois',
    saturationIndex: 22,
    bestPlatforms: ['X / Twitter', 'YouTube Shorts', 'LinkedIn'],
    optimalFormat: 'Deep-dive Thread pédagogique + Schémas d\'architecture',
    trendingKeywords: ['RWA', 'Tokenisation', 'BlackRock Crypto', 'DeFi 3.0', 'Immobilier Fractionné'],
    recommendedHooks: [
      "BlackRock et les plus grandes banques mondiales s'emparent discrètement de cette technologie. Ce n'est pas ce que vous croyez :",
      "Comment investir dans l'immobilier new-yorkais avec seulement 100€ grâce à la tokenisation RWA :",
      "Le guide ultime pour comprendre les Real World Assets avant l'explosion du prochain cycle financier :"
    ],
    nicheSummary: 'Sujet à forte valeur ajoutée perçue. Idéal pour bâtir une autorité incontestable sur LinkedIn et Twitter.',
    topAudience: 'Investisseurs, Financiers, Passionnés Web3, Cadres',
    monetizationPotential: 'Maximum (Advisory, Newsletters premium, Affiliation)'
  },
  {
    id: 'niche-6',
    category: 'ecommerce',
    title: 'TikTok Shop & Live Shopping Automatisé',
    subtitle: 'Générer des millions de ventes directes avec des formats UGC hyper-ciblés et affiliés IA',
    viralityScore: 93,
    growthRate: '+310%',
    competition: 'Moyenne',
    searchVolume: '740K / mois',
    saturationIndex: 38,
    bestPlatforms: ['TikTok', 'Instagram', 'YouTube Shorts'],
    optimalFormat: 'Démonstration produit sans visage (Faceless) + Preuve sociale',
    trendingKeywords: ['TikTok Shop', 'Affiliation Virale', 'Faceless Video', 'UGC Ads', 'Winning Product'],
    recommendedHooks: [
      "Ce produit génère 45 000€ par jour sur TikTok Shop sans jamais montrer un seul visage. Analyse du phénomène :",
      "La méthode exacte pour transformer 1 vidéo de 15 secondes en 300 ventes directes sans dépenser 1€ en pub :",
      "3 erreurs fatales qui tuent votre boutique en ligne avant même votre première vente :"
    ],
    nicheSummary: 'Les études de cas et décorticages de produits gagnants cartonnent auprès d\'un public jeune et ambitieux.',
    topAudience: 'E-commerçants, Dropshippers modernes, Agences UGC',
    monetizationPotential: 'Très Élevé (Vente de produits, Formations, Outils SaaS)'
  }
];

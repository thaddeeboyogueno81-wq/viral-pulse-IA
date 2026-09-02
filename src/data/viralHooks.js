// Bibliothèque avancée de hooks et structures psychologiques virales

export const HOOK_CATEGORIES = [
  { id: 'all', name: 'Tous les Hooks' },
  { id: 'curiosity', name: 'Curiosité & Mystère', icon: 'Eye' },
  { id: 'contrarian', name: 'Contre-intuitif / Choc', icon: 'Zap' },
  { id: 'storytelling', name: 'Storytelling & Échec/Succès', icon: 'BookOpen' },
  { id: 'framework', name: 'Framework & Listicle', icon: 'List' },
  { id: 'authority', name: 'Autorité & Chiffres', icon: 'Award' },
];

export const VIRAL_HOOK_FORMULAS = [
  {
    id: 'hook-1',
    category: 'contrarian',
    type: 'Rupture de croyance',
    title: 'Le conseil populaire est faux',
    template: '99% des gens pensent que [Croyance Commune]. La vérité ? C\'est exactement l\'inverse. Voici pourquoi :',
    example: '99% des gens pensent qu\'il faut poster 5 fois par jour. La vérité ? C\'est exactement l\'inverse. Voici pourquoi :',
    viralScore: 97,
    retentionRate: '88%',
    recommendedFor: ['X / Twitter', 'LinkedIn', 'TikTok']
  },
  {
    id: 'hook-2',
    category: 'curiosity',
    type: 'Secret / Outil Méconnu',
    title: 'La ressource secrète',
    template: 'J\'ai passé [Durée] à chercher le meilleur outil pour [Objectif]. J\'ai trouvé cette pépite gratuite que personne ne connaît :',
    example: 'J\'ai passé 6 mois à chercher le meilleur outil pour automatiser mes posts. J\'ai trouvé cette pépite gratuite que personne ne connaît :',
    viralScore: 95,
    retentionRate: '92%',
    recommendedFor: ['TikTok', 'Instagram Reels', 'X / Twitter']
  },
  {
    id: 'hook-3',
    category: 'authority',
    type: 'Preuve par les chiffres',
    title: 'De X à Y en Z jours',
    template: 'Comment passer de [Situation Initiale] à [Résultat Concret] en [Durée Réaliste] (sans [Contrainte Détestée]) :',
    example: 'Comment passer de 0 à 50 000 abonnés qualifiés en 90 jours (sans dépenser 1€ en publicité) :',
    viralScore: 99,
    retentionRate: '94%',
    recommendedFor: ['LinkedIn', 'YouTube Shorts', 'Instagram']
  },
  {
    id: 'hook-4',
    category: 'storytelling',
    type: 'Récit d\'erreur fatale',
    title: 'La plus grosse erreur',
    template: 'À mes débuts en [Domaine], j\'ai perdu [Argent/Temps]. Ne faites pas la même bêtise, voici ce que j\'ai appris :',
    example: 'À mes débuts en création de contenu, j\'ai perdu 8 mois sur des stratégies obsolètes. Ne faites pas la même bêtise, voici ce que j\'ai appris :',
    viralScore: 93,
    retentionRate: '85%',
    recommendedFor: ['LinkedIn', 'Threads', 'TikTok']
  },
  {
    id: 'hook-5',
    category: 'framework',
    type: 'Guide Actionnable',
    title: 'La Checklist en 5 étapes',
    template: 'Le guide étape par étape pour [Résultat Désiré] même si vous partez de zéro aujourd\'hui :',
    example: 'Le guide étape par étape pour automatiser 100% de votre création de contenu même si vous partez de zéro aujourd\'hui :',
    viralScore: 94,
    retentionRate: '89%',
    recommendedFor: ['LinkedIn', 'X / Twitter']
  },
  {
    id: 'hook-6',
    category: 'contrarian',
    type: 'Avertissement / Urgence',
    title: 'Ce qui va disparaître',
    template: 'Si vous faites encore [Habitude Dépassée], vous perdez un temps fou. Voici la méthode 2026 :',
    example: 'Si vous écrivez encore vos posts manuellement mot par mot, vous perdez un temps fou. Voici la méthode 2026 :',
    viralScore: 96,
    retentionRate: '91%',
    recommendedFor: ['TikTok', 'YouTube Shorts', 'Instagram Reels']
  }
];

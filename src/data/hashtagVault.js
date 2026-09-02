// Base de données et règles de hashtags par plateforme et par niche

export const PLATFORM_HASHTAG_RULES = {
  twitter: {
    name: 'X / Twitter',
    maxRecommended: 3,
    minRecommended: 1,
    tip: 'L\'algorithme X pénalise les posts avec plus de 3 hashtags. Priorisez 2 tags ultra-ciblés.',
    preferredTierRatio: { tier1: 1, tier2: 1, tier3: 1 }
  },
  linkedin: {
    name: 'LinkedIn',
    maxRecommended: 5,
    minRecommended: 3,
    tip: 'L\'algorithme LinkedIn privilégie 3 à 5 hashtags professionnels. Placez-les toujours en fin de post.',
    preferredTierRatio: { tier1: 1, tier2: 2, tier3: 2 }
  },
  instagram: {
    name: 'Instagram',
    maxRecommended: 15,
    minRecommended: 8,
    tip: 'Combinez 3 gros hashtags, 5 de taille moyenne et 5 hyper-niche pour maximiser l\'Explorateur.',
    preferredTierRatio: { tier1: 3, tier2: 6, tier3: 6 }
  },
  tiktok: {
    name: 'TikTok',
    maxRecommended: 5,
    minRecommended: 3,
    tip: 'Évitez #fyp #pourtoi (inefficace). Utilisez des tags décrivant précisément le contenu et la niche.',
    preferredTierRatio: { tier1: 1, tier2: 2, tier3: 2 }
  },
  youtube: {
    name: 'YouTube Shorts',
    maxRecommended: 4,
    minRecommended: 3,
    tip: '3 hashtags clés dans la description suffisent pour indexer votre short dans le bon cluster.',
    preferredTierRatio: { tier1: 1, tier2: 2, tier3: 1 }
  },
  threads: {
    name: 'Threads',
    maxRecommended: 1,
    minRecommended: 1,
    tip: 'Threads utilise désormais le système de Topic Tag (1 seul tag thématique cliquable par post).',
    preferredTierRatio: { tier1: 0, tier2: 1, tier3: 0 }
  }
};

export const HASHTAG_DATABASE = {
  'ai-tech': {
    tier1: [
      { tag: '#IntelligenceArtificielle', volume: '14.2M', competition: 'Haute' },
      { tag: '#ArtificialIntelligence', volume: '38.5M', competition: 'Très Haute' },
      { tag: '#TechTrends', volume: '11.8M', competition: 'Haute' },
      { tag: '#GenerativeAI', volume: '8.4M', competition: 'Haute' },
      { tag: '#FutureOfWork', volume: '9.2M', competition: 'Moyenne' },
    ],
    tier2: [
      { tag: '#AgentsIA', volume: '940K', competition: 'Moyenne' },
      { tag: '#AIAutomation', volume: '1.6M', competition: 'Moyenne' },
      { tag: '#PromptEngineering', volume: '2.1M', competition: 'Moyenne' },
      { tag: '#NoCodeAutomation', volume: '780K', competition: 'Modérée' },
      { tag: '#AITools', volume: '3.4M', competition: 'Moyenne' },
      { tag: '#ProductiviteIA', volume: '420K', competition: 'Faible' },
    ],
    tier3: [
      { tag: '#AutoGPTFr', volume: '95K', competition: 'Faible' },
      { tag: '#MakeAutomation', volume: '180K', competition: 'Faible' },
      { tag: '#AgenticAI', volume: '310K', competition: 'Faible' },
      { tag: '#WorkflowsIntelligents', volume: '65K', competition: 'Très Faible' },
      { tag: '#AutomatisationBusiness', volume: '140K', competition: 'Faible' },
    ]
  },
  'solopreneur': {
    tier1: [
      { tag: '#Entrepreneuriat', volume: '16.5M', competition: 'Haute' },
      { tag: '#BusinessEnLigne', volume: '7.8M', competition: 'Haute' },
      { tag: '#EntrepreneurLife', volume: '22.1M', competition: 'Très Haute' },
      { tag: '#Startup', volume: '45.0M', competition: 'Très Haute' },
    ],
    tier2: [
      { tag: '#Solopreneur', volume: '3.2M', competition: 'Moyenne' },
      { tag: '#BuildInPublic', volume: '2.8M', competition: 'Moyenne' },
      { tag: '#MicroSaaS', volume: '1.1M', competition: 'Modérée' },
      { tag: '#IndieHacker', volume: '1.9M', competition: 'Modérée' },
      { tag: '#RevenusPassifs', volume: '2.4M', competition: 'Moyenne' },
    ],
    tier3: [
      { tag: '#SolopreneurFr', volume: '120K', competition: 'Faible' },
      { tag: '#BootstrappingFr', volume: '85K', competition: 'Très Faible' },
      { tag: '#IndieMaker', volume: '340K', competition: 'Faible' },
      { tag: '#OnePersonBusiness', volume: '490K', competition: 'Faible' },
      { tag: '#LiberteFinanciereFr', volume: '260K', competition: 'Faible' },
    ]
  },
  'creator-growth': {
    tier1: [
      { tag: '#ContentCreator', volume: '32.0M', competition: 'Très Haute' },
      { tag: '#SocialMediaMarketing', volume: '28.4M', competition: 'Haute' },
      { tag: '#CreationDeContenu', volume: '4.8M', competition: 'Moyenne' },
      { tag: '#DigitalMarketing', volume: '41.2M', competition: 'Très Haute' },
    ],
    tier2: [
      { tag: '#ViralGrowth', volume: '1.8M', competition: 'Moyenne' },
      { tag: '#TikTokGrowth', volume: '3.9M', competition: 'Moyenne' },
      { tag: '#PersonalBrandingFr', volume: '620K', competition: 'Modérée' },
      { tag: '#ConseilsTikTok', volume: '980K', competition: 'Modérée' },
      { tag: '#ShortsCreator', volume: '2.3M', competition: 'Moyenne' },
    ],
    tier3: [
      { tag: '#CroissanceOrganique', volume: '190K', competition: 'Faible' },
      { tag: '#AlgorithmeTikTok2026', volume: '88K', competition: 'Très Faible' },
      { tag: '#StrategieContenu', volume: '310K', competition: 'Faible' },
      { tag: '#HooksViraux', volume: '115K', competition: 'Très Faible' },
      { tag: '#RetentionVideo', volume: '95K', competition: 'Très Faible' },
    ]
  },
  'productivity': {
    tier1: [
      { tag: '#Productivite', volume: '5.6M', competition: 'Moyenne' },
      { tag: '#Productivity', volume: '24.1M', competition: 'Haute' },
      { tag: '#SelfImprovement', volume: '19.8M', competition: 'Haute' },
      { tag: '#DeveloppementPersonnel', volume: '12.4M', competition: 'Haute' },
    ],
    tier2: [
      { tag: '#DeepWork', volume: '1.4M', competition: 'Modérée' },
      { tag: '#BiohackingFr', volume: '380K', competition: 'Faible' },
      { tag: '#DopamineDetox', volume: '1.9M', competition: 'Moyenne' },
      { tag: '#HabitsForSuccess', volume: '2.8M', competition: 'Moyenne' },
      { tag: '#OrganisationEfficace', volume: '450K', competition: 'Faible' },
    ],
    tier3: [
      { tag: '#RoutineMatinaleEfficace', volume: '110K', competition: 'Très Faible' },
      { tag: '#FocusProfond', volume: '75K', competition: 'Très Faible' },
      { tag: '#OptimisationCerebrale', volume: '60K', competition: 'Très Faible' },
      { tag: '#GestionDuTempsPro', volume: '140K', competition: 'Faible' },
    ]
  },
  'finance-crypto': {
    tier1: [
      { tag: '#Investissement', volume: '8.9M', competition: 'Haute' },
      { tag: '#FinancePerso', volume: '3.4M', competition: 'Moyenne' },
      { tag: '#Crypto', volume: '62.0M', competition: 'Très Haute' },
      { tag: '#Bourse', volume: '4.2M', competition: 'Moyenne' },
    ],
    tier2: [
      { tag: '#Web3Finance', volume: '1.2M', competition: 'Modérée' },
      { tag: '#Tokenisation', volume: '890K', competition: 'Modérée' },
      { tag: '#DeFiFr', volume: '340K', competition: 'Faible' },
      { tag: '#InvestissementMalin', volume: '720K', competition: 'Modérée' },
      { tag: '#RealWorldAssets', volume: '950K', competition: 'Modérée' },
    ],
    tier3: [
      { tag: '#RWAinvesting', volume: '130K', competition: 'Très Faible' },
      { tag: '#ImmobilierFractionne', volume: '90K', competition: 'Très Faible' },
      { tag: '#PatrimoineCrypto', volume: '160K', competition: 'Faible' },
      { tag: '#TokenisationRWA', volume: '70K', competition: 'Très Faible' },
    ]
  },
  'ecommerce': {
    tier1: [
      { tag: '#Ecommerce', volume: '39.0M', competition: 'Très Haute' },
      { tag: '#Dropshipping', volume: '27.4M', competition: 'Haute' },
      { tag: '#VenteEnLigne', volume: '3.8M', competition: 'Moyenne' },
    ],
    tier2: [
      { tag: '#TikTokShopFr', volume: '890K', competition: 'Modérée' },
      { tag: '#EcommerceTips', volume: '2.1M', competition: 'Moyenne' },
      { tag: '#BoutiqueEnLigne', volume: '1.4M', competition: 'Modérée' },
      { tag: '#UGCCreatorFr', volume: '650K', competition: 'Faible' },
    ],
    tier3: [
      { tag: '#TikTokShopStrategy', volume: '210K', competition: 'Faible' },
      { tag: '#WinningProduct2026', volume: '140K', competition: 'Faible' },
      { tag: '#VentesAutomatisees', volume: '85K', competition: 'Très Faible' },
    ]
  }
};

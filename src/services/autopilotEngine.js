import { TRENDING_NICHES } from '../data/trendingNiches';
import { generateMultiPlatformContent } from './aiEngine';
import { StorageService } from './storage';

// Moteur d'exécution autonome du Pilote Automatique

export const AutopilotEngine = {
  /**
   * Exécute un cycle de génération autonome
   * Crée des publications optimisées pour les niches sélectionnées
   */
  runCycle: async (customSettings = null) => {
    const settings = customSettings || StorageService.getAutopilotSettings();
    const candidateNiches = TRENDING_NICHES.filter(n => 
      !settings.preferredNiches || settings.preferredNiches.length === 0 || settings.preferredNiches.includes(n.category)
    );

    const pool = candidateNiches.length > 0 ? candidateNiches : TRENDING_NICHES;
    // Sélectionne une niche au hasard parmi les meilleures
    const selectedNiche = pool[Math.floor(Math.random() * pool.length)];
    const selectedTone = settings.preferredTones && settings.preferredTones.length > 0 
      ? settings.preferredTones[Math.floor(Math.random() * settings.preferredTones.length)] 
      : 'expert';

    const hook = selectedNiche.recommendedHooks[Math.floor(Math.random() * selectedNiche.recommendedHooks.length)];

    // Génération multi-plateforme
    const generated = await generateMultiPlatformContent({
      topic: selectedNiche.title,
      category: selectedNiche.category,
      tone: selectedTone,
      customHook: hook,
      targetAudience: selectedNiche.topAudience
    });

    const now = Date.now();
    const newPosts = [];
    const targetPlatforms = settings.targetPlatforms || ['twitter', 'linkedin', 'instagram', 'tiktok'];

    targetPlatforms.forEach((platformKey, index) => {
      if (generated.platforms[platformKey]) {
        const platformData = generated.platforms[platformKey];
        // Calcul d'un horaire échelonné
        const scheduleOffsetHours = (index + 1) * 3 + Math.floor(Math.random() * 2);
        const scheduledDate = new Date(now + scheduleOffsetHours * 3600 * 1000).toISOString();

        const postObject = {
          title: `${selectedNiche.title} (${platformData.title})`,
          topic: selectedNiche.title,
          category: selectedNiche.category,
          platform: platformKey,
          content: platformData.content,
          hashtags: platformData.hashtags,
          viralityScore: platformData.viralityScore,
          estimatedImpressions: platformData.estimatedImpressions,
          status: settings.mode === 'full_auto' ? 'scheduled' : 'pending_approval',
          scheduledFor: scheduledDate,
          tone: selectedTone,
          visualPrompt: generated.visualPrompt,
          generatedBy: 'Autopilot AI Agent 2.0',
          analytics: {
            predictedLikes: Math.floor(platformData.viralityScore * 18.5),
            predictedShares: Math.floor(platformData.viralityScore * 4.2),
            predictedComments: Math.floor(platformData.viralityScore * 2.8)
          }
        };

        const saved = StorageService.addScheduledPost(postObject);
        newPosts.push(saved);
      }
    });

    // Mettre à jour l'heure de dernier passage
    StorageService.saveAutopilotSettings({
      ...settings,
      lastRunTime: new Date().toISOString()
    });

    return {
      niche: selectedNiche,
      generatedPosts: newPosts,
      totalCreated: newPosts.length
    };
  },

  /**
   * Génère un calendrier complet pour les 7 prochains jours
   */
  generateWeeklyBatch: async (count = 7) => {
    const settings = StorageService.getAutopilotSettings();
    const created = [];
    
    for (let i = 0; i < count; i++) {
      const niche = TRENDING_NICHES[i % TRENDING_NICHES.length];
      const tone = settings.preferredTones[i % (settings.preferredTones?.length || 1)] || 'expert';
      const hook = niche.recommendedHooks[i % niche.recommendedHooks.length];

      const gen = await generateMultiPlatformContent({
        topic: niche.title,
        category: niche.category,
        tone: tone,
        customHook: hook
      });

      // Choix de 2 plateformes principales par jour
      const platforms = ['twitter', 'linkedin', 'instagram', 'tiktok'];
      const p1 = platforms[i % platforms.length];
      const p2 = platforms[(i + 2) % platforms.length];

      [p1, p2].forEach((pKey, pIdx) => {
        const pData = gen.platforms[pKey];
        const postDate = new Date(Date.now() + (i * 24 + (pIdx === 0 ? 9 : 17)) * 3600 * 1000).toISOString();
        
        const post = StorageService.addScheduledPost({
          title: `${niche.title} • ${pData.title}`,
          topic: niche.title,
          category: niche.category,
          platform: pKey,
          content: pData.content,
          hashtags: pData.hashtags,
          viralityScore: pData.viralityScore,
          estimatedImpressions: pData.estimatedImpressions,
          status: 'scheduled',
          scheduledFor: postDate,
          tone: tone,
          visualPrompt: gen.visualPrompt,
          generatedBy: 'Weekly Autopilot Batch'
        });
        created.push(post);
      });
    }

    return created;
  }
};

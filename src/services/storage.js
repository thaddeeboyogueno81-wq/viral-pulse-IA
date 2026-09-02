// Service de persistance locale pour ViralPulse AI

const STORAGE_KEYS = {
  SCHEDULED_POSTS: 'viralpulse_scheduled_posts',
  PUBLISHED_POSTS: 'viralpulse_published_posts',
  CHANNELS: 'viralpulse_channels',
  AUTOPILOT_SETTINGS: 'viralpulse_autopilot_settings',
  APP_SETTINGS: 'viralpulse_app_settings',
  SAVED_IDEAS: 'viralpulse_saved_ideas'
};

export const StorageService = {
  // Récupérer les posts planifiés
  getScheduledPosts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_POSTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading scheduled posts', e);
      return [];
    }
  },

  saveScheduledPosts: (posts) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error('Error saving scheduled posts', e);
    }
  },

  // Ajouter un nouveau post planifié
  addScheduledPost: (post) => {
    const posts = StorageService.getScheduledPosts();
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: post.status || 'scheduled', // 'scheduled', 'published', 'draft', 'pending_approval'
      scheduledFor: post.scheduledFor || new Date(Date.now() + 3600 * 1000 * 4).toISOString(),
      createdAt: new Date().toISOString(),
      ...post
    };
    posts.unshift(newPost);
    StorageService.saveScheduledPosts(posts);
    return newPost;
  },

  // Mettre à jour un post
  updatePost: (id, updates) => {
    const posts = StorageService.getScheduledPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      StorageService.saveScheduledPosts(posts);
      return posts[index];
    }
    return null;
  },

  // Supprimer un post
  deletePost: (id) => {
    const posts = StorageService.getScheduledPosts();
    const filtered = posts.filter(p => p.id !== id);
    StorageService.saveScheduledPosts(filtered);
    return filtered;
  },

  // Paramètres du pilote automatique
  getAutopilotSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTOPILOT_SETTINGS);
      return data ? JSON.parse(data) : {
        enabled: true,
        mode: 'approval', // 'full_auto' ou 'approval' (validation en 1-clic)
        postsPerDay: 3,
        preferredNiches: ['ai-tech', 'solopreneur', 'creator-growth'],
        preferredTones: ['expert', 'provocative'],
        targetPlatforms: ['twitter', 'linkedin', 'instagram', 'tiktok'],
        postingTimes: ['08:30', '13:15', '18:45'],
        autoHashtags: true,
        autoImagePrompts: true,
        lastRunTime: null
      };
    } catch (e) {
      return {};
    }
  },

  saveAutopilotSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTOPILOT_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving autopilot settings', e);
    }
  },

  // Paramètres généraux (Clés API, Webhooks)
  getAppSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return data ? JSON.parse(data) : {
        geminiApiKey: '',
        geminiModel: 'auto', // 'auto', 'gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', etc.
        openAiApiKey: '',
        customWebhookUrl: 'https://hook.eu1.make.com/viralpulse-auto-relay',
        notificationEmail: 'user@example.com',
        enableNotifications: true,
        language: 'fr'
      };
    } catch (e) {
      return {};
    }
  },

  saveAppSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving app settings', e);
    }
  }
};

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NicheRadar from './components/NicheRadar';
import ContentStudio from './components/ContentStudio';
import HashtagGenerator from './components/HashtagGenerator';
import AutopilotScheduler from './components/AutopilotScheduler';
import ViralityPredictor from './components/ViralityPredictor';
import AIRevisorChat from './components/AIRevisorChat';
import ChannelManager from './components/ChannelManager';
import SettingsModal from './components/SettingsModal';
import PostDetailModal from './components/PostDetailModal';
import PricingModal from './components/PricingModal';
import LicenseActivator from './components/LicenseActivator';
import { StorageService } from './services/storage';
import { getCurrentPlan } from './services/planService';

export default function App() {
  const [activeTab, setActiveTab] = useState('radar');
  const [nicheForStudio, setNicheForStudio] = useState(null);
  const [autopilotActive, setAutopilotActive] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(getCurrentPlan());

  const refreshScheduledPosts = () => {
    setScheduledPosts(StorageService.getScheduledPosts());
  };

  const refreshPlan = () => {
    const plan = getCurrentPlan();
    setCurrentPlan(plan);
    // Déclenche un event pour que Navbar se rafraîchisse aussi
    window.dispatchEvent(new Event('viralpulse:plan-updated'));
  };

  useEffect(() => {
    refreshScheduledPosts();
    const autopilotSettings = StorageService.getAutopilotSettings();
    if (autopilotSettings.enabled !== undefined) {
      setAutopilotActive(autopilotSettings.enabled);
    }
  }, []);

  const handleToggleAutopilot = () => {
    const nextState = !autopilotActive;
    setAutopilotActive(nextState);
    const settings = StorageService.getAutopilotSettings();
    StorageService.saveAutopilotSettings({ ...settings, enabled: nextState });
  };

  const handleSelectNicheFromRadar = (niche) => {
    setNicheForStudio(niche);
    setActiveTab('studio');
  };

  const handleOpenLicense = () => {
    setIsPricingOpen(false);
    setIsLicenseOpen(true);
  };

  const handlePlanActivated = (plan) => {
    refreshPlan();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col relative overflow-x-hidden bg-cyber-grid">

      {/* Cyber Ambient Glow Orbs */}
      <div className="cyber-glow-orb-1" />
      <div className="cyber-glow-orb-2" />

      {/* Top Navbar */}
      <Navbar
        autopilotActive={autopilotActive}
        onToggleAutopilot={handleToggleAutopilot}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        scheduledCount={scheduledPosts.filter(p => p.status !== 'published').length}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row relative z-10">

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        {/* Dynamic Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'radar' && (
            <NicheRadar onSelectNicheForStudio={handleSelectNicheFromRadar} />
          )}

          {activeTab === 'studio' && (
            <ContentStudio
              initialNiche={nicheForStudio}
              onScheduleSuccess={refreshScheduledPosts}
              onOpenPricing={() => setIsPricingOpen(true)}
            />
          )}

          {activeTab === 'hashtags' && (
            <HashtagGenerator onOpenPricing={() => setIsPricingOpen(true)} />
          )}

          {activeTab === 'scheduler' && (
            <AutopilotScheduler
              onSelectPostForEdit={(post) => setSelectedPostForEdit(post)}
              onOpenPricing={() => setIsPricingOpen(true)}
            />
          )}

          {activeTab === 'predictor' && (
            <ViralityPredictor />
          )}

          {activeTab === 'copilot' && (
            <AIRevisorChat onOpenPricing={() => setIsPricingOpen(true)} />
          )}

          {activeTab === 'channels' && (
            <ChannelManager onOpenPricing={() => setIsPricingOpen(true)} />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsUpdated={refreshScheduledPosts}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onActivateLicense={handleOpenLicense}
      />

      {/* License Activator Modal */}
      <LicenseActivator
        isOpen={isLicenseOpen}
        onClose={() => setIsLicenseOpen(false)}
        onPlanActivated={handlePlanActivated}
      />

      {/* Post Detail / Edit Modal */}
      <PostDetailModal
        post={selectedPostForEdit}
        isOpen={!!selectedPostForEdit}
        onClose={() => setSelectedPostForEdit(null)}
        onPostUpdated={refreshScheduledPosts}
      />

    </div>
  );
}

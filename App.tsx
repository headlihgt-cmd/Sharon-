
import React, { useState, useEffect, useCallback } from 'react';
import { ThemeType, UserState, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ChatView from './components/ChatView';
import LiveView from './components/LiveView';
import StudioView from './components/StudioView';
import SettingsView from './components/SettingsView';
import SubscriptionModal from './components/SubscriptionModal';
import { speakNotification } from './services/geminiService';

const INITIAL_STATE: UserState = {
  isSubscribed: false,
  photosGeneratedToday: 0,
  videosGeneratedThisWeek: 0,
  musicGeneratedThisWeek: 0,
  lastPhotoReset: new Date().toISOString(),
  lastVideoReset: new Date().toISOString(),
  theme: ThemeType.ROBOTIC,
  behavior: 'Joyeuse',
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'live' | 'studio' | 'settings'>('chat');
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('sharon_user_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  const [showSubModal, setShowSubModal] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('sharon_user_state', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkKey();
  }, []);

  const toggleSubscription = useCallback(() => {
    setUserState(prev => {
      const newState = !prev.isSubscribed;
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
      return { 
        ...prev, 
        isSubscribed: newState,
        subscriptionExpiry: newState ? expiryDate.toISOString() : undefined
      };
    });
  }, []);

  const getThemeStyles = () => {
    switch (userState.theme) {
      case ThemeType.GOLDEN: return "bg-amber-950/80 text-amber-100 border-amber-500/30";
      case ThemeType.LIGHT: return "bg-slate-50 text-slate-900 border-slate-200";
      case ThemeType.DARK: return "bg-slate-950 text-slate-100 border-slate-800";
      case ThemeType.ROBOTIC: return "bg-cyan-950/90 text-cyan-50 border-cyan-500/40";
      default: return "bg-black text-white border-white/10";
    }
  };

  const getPageBackground = () => {
    switch (userState.theme) {
      case ThemeType.GOLDEN: return "from-amber-900 via-amber-950 to-black";
      case ThemeType.LIGHT: return "from-slate-100 via-slate-200 to-white";
      case ThemeType.DARK: return "from-slate-900 via-black to-slate-900";
      case ThemeType.ROBOTIC: return "from-cyan-950 via-slate-950 to-cyan-900";
      default: return "from-black to-slate-900";
    }
  };

  if (!apiKeySelected) {
    return (
      <div className={`h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br ${getPageBackground()} p-6`}>
        <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center space-y-6 max-w-sm w-full">
          <h2 className="text-2xl font-black italic">ACTIVATION REQUISE</h2>
          <p className="text-sm opacity-70 font-medium">Configurez Sharon pour votre Android via une clé Google Cloud.</p>
          <button 
            onClick={() => window.aistudio.openSelectKey().then(() => setApiKeySelected(true))}
            className="w-full py-4 bg-cyan-500 text-white rounded-2xl font-bold shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Sélectionner ma clé
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-full flex flex-col md:flex-row relative overflow-hidden bg-gradient-to-br ${getPageBackground()} transition-all duration-1000`}>
      {!isMobile && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} themeStyles={getThemeStyles()} />}
      
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden pb-20 md:pb-0">
        <div className="page-transition h-full flex flex-col">
          {activeTab === 'chat' && <ChatView userState={userState} setUserState={setUserState} themeStyles={getThemeStyles()} />}
          {activeTab === 'live' && <LiveView userState={userState} themeStyles={getThemeStyles()} />}
          {activeTab === 'studio' && <StudioView userState={userState} setUserState={setUserState} onUpgrade={() => setShowSubModal(true)} themeStyles={getThemeStyles()} />}
          {activeTab === 'settings' && <SettingsView userState={userState} setUserState={setUserState} themeStyles={getThemeStyles()} onUpgrade={() => setShowSubModal(true)} />}
        </div>
      </main>

      {isMobile && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}

      {showSubModal && (
        <SubscriptionModal onClose={() => setShowSubModal(false)} onSubscribe={toggleSubscription} isSubscribed={userState.isSubscribed} />
      )}
    </div>
  );
};

export default App;

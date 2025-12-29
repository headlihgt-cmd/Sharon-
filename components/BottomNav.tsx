
import React from 'react';
import { MessageSquare, Cpu, Image, Settings, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'chat' | 'live' | 'studio' | 'settings';
  setActiveTab: (tab: 'chat' | 'live' | 'studio' | 'settings') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'live', label: 'Ops', icon: Cpu },
    { id: 'studio', label: 'Studio', icon: Image },
    { id: 'settings', label: 'Plus', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-50 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all relative ${
              isActive ? 'text-cyan-400' : 'text-white/40'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-8 h-1 bg-cyan-400 rounded-full blur-sm"></span>
            )}
            <Icon size={24} className={isActive ? 'animate-pulse' : ''} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

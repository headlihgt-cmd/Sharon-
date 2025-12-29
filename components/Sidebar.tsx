
import React from 'react';
import { MessageSquare, Image, Settings, Music, Film, Bell, Cpu, Camera } from 'lucide-react';
import { SharonIcon } from './SharonIcon';

interface SidebarProps {
  activeTab: 'chat' | 'live' | 'studio' | 'settings';
  setActiveTab: (tab: 'chat' | 'live' | 'studio' | 'settings') => void;
  themeStyles: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, themeStyles }) => {
  const tabs = [
    { id: 'chat', label: 'Chat Sharon', icon: MessageSquare },
    { id: 'live', label: 'Spécial Ops', icon: Cpu },
    { id: 'studio', label: 'Studio Créatif', icon: Image },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  // These are the specialized generation icons requested to be "where others are"
  const generationTools = [
    { icon: Camera, label: 'Photos' },
    { icon: Film, label: 'Vidéos' },
    { icon: Music, label: 'Musique' },
    { icon: Bell, label: 'Alertes' },
  ];

  return (
    <nav className={`w-20 md:w-64 h-full flex flex-col items-center py-6 space-y-6 z-20 ${themeStyles} border-r shadow-2xl transition-all duration-500`}>
      <div className="flex flex-col items-center mb-6">
        <SharonIcon size="w-16 h-16" />
        <div className="hidden md:block mt-3 text-center">
          <span className="text-2xl font-black tracking-tighter block">Sharon</span>
          <span className="text-[9px] font-bold opacity-70 tracking-[0.4em] uppercase text-cyan-400">By HeadLights</span>
        </div>
      </div>

      <div className="w-full px-3 space-y-1">
        <p className="hidden md:block text-[10px] font-bold opacity-30 uppercase ml-4 mb-2 tracking-widest">Navigation</p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-center md:justify-start px-4 py-3 rounded-2xl transition-all duration-300 group
                ${isActive ? 'bg-white/10 shadow-lg border border-white/10' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
            >
              <Icon size={22} className={`${isActive ? 'text-cyan-400 scale-110' : 'group-hover:text-cyan-300'}`} />
              <span className={`hidden md:block ml-4 font-bold transition-colors ${isActive ? 'text-white' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full px-3 pt-4 border-t border-white/5 space-y-4">
        <p className="hidden md:block text-[10px] font-bold opacity-30 uppercase ml-4 mb-2 tracking-widest">Générations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2">
           {generationTools.map((tool, idx) => (
             <button 
              key={idx} 
              onClick={() => setActiveTab('studio')}
              className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-400 transition-all flex flex-col items-center justify-center group border border-white/5" 
              title={tool.label}
             >
                <tool.icon size={20} />
                <span className="hidden md:block text-[8px] mt-1 font-black uppercase opacity-40 group-hover:opacity-100">{tool.label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="mt-auto px-4 w-full">
        <div className="hidden md:block glass rounded-3xl p-4 text-center border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <p className="text-[9px] font-black opacity-30 uppercase mb-1">Propulsé par</p>
          <p className="text-xs font-bold tracking-tight">HeadLights.company</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

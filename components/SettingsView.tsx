
import React from 'react';
import { ThemeType, UserState } from '../types';
import { Palette, Info, CreditCard, Upload, BarChart3, Clock, Zap, Smile, Heart, Zap as Sparkle, MessageSquare, Volume2, Book, Monitor, Coffee } from 'lucide-react';

interface SettingsViewProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  themeStyles: string;
  onUpgrade: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userState, setUserState, themeStyles, onUpgrade }) => {
  
  const themes = [
    { id: ThemeType.LIGHT, label: 'Clair', color: 'bg-white' },
    { id: ThemeType.DARK, label: 'Sombre', color: 'bg-gray-800' },
    { id: ThemeType.GOLDEN, label: 'Doré', color: 'bg-amber-500' },
    { id: ThemeType.ROBOTIC, label: 'Robotique', color: 'bg-cyan-600' },
  ];

  const behaviors = [
    { id: 'Joyeuse', icon: Smile, color: 'text-yellow-400' },
    { id: 'Colérique', icon: Sparkle, color: 'text-red-500' },
    { id: 'Spirituelle', icon: Book, color: 'text-indigo-400' },
    { id: 'Amoureuse', icon: Heart, color: 'text-pink-500' },
    { id: 'Comique', icon: Coffee, color: 'text-orange-400' },
    { id: 'Drôle', icon: Volume2, color: 'text-green-400' },
    { id: 'Actrice', icon: Monitor, color: 'text-purple-400' },
    { id: 'Poète', icon: MessageSquare, color: 'text-blue-300' },
    { id: 'Cyberpunk', icon: Zap, color: 'text-cyan-400' },
    { id: 'Zen', icon: Info, color: 'text-emerald-400' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserState(prev => ({ 
          ...prev, 
          theme: ThemeType.CUSTOM, 
          customThemeUrl: event.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getRemainingDays = () => {
    if (!userState.isSubscribed || !userState.subscriptionExpiry) return 0;
    const expiry = new Date(userState.subscriptionExpiry);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const stats = [
    { label: 'Photos', remaining: userState.isSubscribed ? 'Illimité' : `${Math.max(0, 10 - userState.photosGeneratedToday)} restants` },
    { label: 'Vidéos', remaining: userState.isSubscribed ? 'Illimité' : `${Math.max(0, 2 - userState.videosGeneratedThisWeek)} restants` },
    { label: 'Musique', remaining: userState.isSubscribed ? 'Illimité' : 'Pro Requis' },
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold tracking-tighter">Paramètres</h1>
          <p className="opacity-60 font-medium">Contrôlez l'âme et l'apparence de Sharon</p>
        </header>

        {/* Dashboard de Consommation */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-xl font-bold">
            <BarChart3 className="text-cyan-400" />
            <h2>Tableau de bord Sharon</h2>
          </div>
          
          <div className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest opacity-40">Service</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest opacity-40">Restant</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest opacity-40">Niveau</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold">{stat.label}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        stat.remaining === 'Illimité' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {stat.remaining}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold opacity-60 uppercase">
                       {userState.isSubscribed ? 'PREMIUM' : 'STANDARD'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-6 bg-cyan-500/5 flex items-center justify-between border-t border-white/5">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                    <Clock size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Durée de l'abonnement</p>
                    <p className="text-lg font-black italic">{userState.isSubscribed ? `${getRemainingDays()} JOURS RESTANTS` : 'AUCUN ABONNEMENT ACTIF'}</p>
                  </div>
               </div>
               {!userState.isSubscribed && (
                 <button onClick={onUpgrade} className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20">
                    <Zap size={14} fill="currentColor" />
                    <span>Passer Pro</span>
                 </button>
               )}
            </div>
          </div>
        </section>

        {/* COMPORTEMENT DE SHARON */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-xl font-bold">
            <Sparkle className="text-purple-400" />
            <h2>Âme de Sharon (Comportement)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {behaviors.map(b => (
              <button
                key={b.id}
                onClick={() => setUserState(prev => ({ ...prev, behavior: b.id }))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                  userState.behavior === b.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 glass hover:bg-white/5'
                }`}
              >
                <b.icon className={b.color} size={24} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{b.id}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-2 text-xl font-bold">
            <Palette className="text-cyan-400" />
            <h2>Apparence & Thèmes</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setUserState(prev => ({ ...prev, theme: t.id }))}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${
                  userState.theme === t.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 glass'
                }`}
              >
                <div className={`w-10 h-10 rounded-full shadow-inner ${t.color}`}></div>
                <span className="text-sm font-semibold">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="relative glass p-6 rounded-3xl border border-white/10 group overflow-hidden">
             <div className="flex items-center justify-between">
                <div>
                   <p className="font-bold">Thème Personnalisé</p>
                   <p className="text-sm opacity-60">Utilisez votre propre image de fond</p>
                </div>
                <label className="cursor-pointer px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center space-x-2">
                   <Upload size={18} />
                   <span>Extraire</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
             </div>
          </div>
        </section>

        <section className="glass p-8 rounded-3xl space-y-6 border border-white/10">
           <div className="flex items-center space-x-2 font-bold opacity-60">
              <Info size={18} />
              <p className="uppercase tracking-widest text-xs">À Propos</p>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs opacity-40 font-black uppercase tracking-tighter">Version du noyau</p>
                <p className="text-xl font-black italic text-cyan-400">Sharon v2.8</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-40 font-black uppercase tracking-tighter">Fondateur</p>
                <p className="text-xl font-black italic">Nsembe kJ</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-40 font-black uppercase tracking-tighter">Compagnie</p>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">HeadLights.company</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;

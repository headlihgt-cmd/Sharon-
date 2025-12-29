
import React, { useState } from 'react';
import { Image as ImageIcon, Film, Music, CheckCircle2, Lock, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateImage, generateVideoOperation, checkVideoStatus, generateMusicDescription } from '../services/geminiService';
import { UserState } from '../types';

interface StudioViewProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  onUpgrade: () => void;
  themeStyles: string;
}

const StudioView: React.FC<StudioViewProps> = ({ userState, setUserState, onUpgrade, themeStyles }) => {
  const [activeMode, setActiveMode] = useState<'photo' | 'video' | 'music'>('photo');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string | null>(null);

  const canGeneratePhoto = userState.isSubscribed || userState.photosGeneratedToday < 10;
  const canGenerateVideo = userState.isSubscribed || userState.videosGeneratedThisWeek < 2;

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setVideoStatus(null);

    try {
      if (activeMode === 'photo') {
        if (!canGeneratePhoto) {
          onUpgrade();
          setLoading(false);
          return;
        }
        const url = await generateImage(prompt);
        setResult(url);
        setUserState(prev => ({ ...prev, photosGeneratedToday: prev.photosGeneratedToday + 1 }));
      } else if (activeMode === 'video') {
        if (!canGenerateVideo) {
          alert("Veuillez regarder une publicité pour continuer ou passez à l'abonnement Pro !");
          onUpgrade();
          setLoading(false);
          return;
        }
        setVideoStatus("Démarrage de la génération vidéo avec Veo 3.1...");
        let operation = await generateVideoOperation(prompt);
        while (!operation.done) {
          setVideoStatus("Patience... Sharon peaufine votre vidéo (cela peut prendre 1-2 minutes).");
          await new Promise(resolve => setTimeout(resolve, 8000));
          operation = await checkVideoStatus(operation);
        }
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
          setResult(`${downloadLink}&key=${process.env.API_KEY}`);
        }
        setUserState(prev => ({ ...prev, videosGeneratedThisWeek: prev.videosGeneratedThisWeek + 1 }));
      } else {
        if (!userState.isSubscribed) {
          onUpgrade();
          setLoading(false);
          return;
        }
        const musicInfo = await generateMusicDescription('Pop', prompt);
        setResult(musicInfo);
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la création.");
    } finally {
      setLoading(false);
      setVideoStatus(null);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Studio Créatif</h1>
            <p className="opacity-60">Donnez vie à vos idées avec Sharon</p>
          </div>
          {!userState.isSubscribed && (
            <button onClick={onUpgrade} className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
              Passer Pro (5$/mois)
            </button>
          )}
        </div>

        <div className="flex space-x-4 glass p-1 rounded-2xl">
          {[
            { id: 'photo', label: 'Photos', icon: ImageIcon },
            { id: 'video', label: 'Vidéos', icon: Film },
            { id: 'music', label: 'Musique', icon: Music },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => { setActiveMode(m.id as any); setResult(null); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl transition-all ${
                activeMode === m.id ? 'bg-white/10 text-white' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <m.icon size={20} />
              <span className="font-semibold">{m.label}</span>
            </button>
          ))}
        </div>

        <div className={`p-8 rounded-3xl ${themeStyles} glass space-y-6`}>
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest opacity-60">Description du projet</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Décrivez votre ${activeMode === 'photo' ? 'image' : activeMode === 'video' ? 'scène vidéo' : 'genre musical'} idéal...`}
              className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-lg"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 shadow-xl shadow-cyan-900/40 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            <span>{loading ? 'Génération en cours...' : 'Générer avec Sharon'}</span>
          </button>

          {!userState.isSubscribed && (
            <div className="flex items-center justify-center space-x-4 text-xs opacity-60">
              {activeMode === 'photo' && <span>Limite gratuite : {10 - userState.photosGeneratedToday}/10 photos aujourd'hui</span>}
              {activeMode === 'video' && <span>Limite gratuite : {2 - userState.videosGeneratedThisWeek}/2 vidéos cette semaine (Pub requise)</span>}
              {activeMode === 'music' && (
                <div className="flex items-center text-amber-400">
                  <Lock size={12} className="mr-1" />
                  <span>Abonnement requis pour la Musique</span>
                </div>
              )}
            </div>
          )}
        </div>

        {videoStatus && (
            <div className="glass p-6 rounded-2xl text-center space-y-4 animate-pulse">
                <p className="text-cyan-400 font-medium">{videoStatus}</p>
            </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold">Votre création est prête</h3>
            <div className="rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl">
              {activeMode === 'photo' && <img src={result} alt="Génération Sharon" className="w-full h-auto" />}
              {activeMode === 'video' && <video src={result} controls autoPlay className="w-full h-auto" />}
              {activeMode === 'music' && (
                <div className="p-8 space-y-6">
                   <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center">
                         <Music className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold">Sharon Radio Mix</p>
                        <p className="text-sm opacity-60">Description et Paroles</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-xl text-sm whitespace-pre-wrap leading-relaxed italic opacity-80">
                      {result}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioView;

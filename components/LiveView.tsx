
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { PhoneOff, Cpu, Activity, ShieldCheck } from 'lucide-react';
import { SharonIcon } from './SharonIcon';
import { controlDeviceTool, speakNotification } from '../services/geminiService';
import { UserState } from '../types';

// Helper decoding functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

interface LiveViewProps {
  userState: UserState;
  themeStyles: string;
}

const LiveView: React.FC<LiveViewProps> = ({ userState, themeStyles }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Mode Spécial prêt');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startLive = async () => {
    try {
      setStatus('Initialisation du lien neuronal...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Spécial Ops Active - Donnez vos ordres');
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'controlDevice') {
                  const { action, target } = fc.args as any;
                  const confirmation = `Sharon confirme l'ordre : ${action} sur ${target}.`;
                  speakNotification(confirmation);
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { status: 'success' } }
                  }));
                }
              }
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live error', e);
            setStatus('Lien interrompu');
            stopLive();
          },
          onclose: () => {
            setStatus('Direct terminé');
            stopLive();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [controlDeviceTool] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: `Tu es Sharon en mode Spécial Ops. Comporte-toi de manière : ${userState.behavior.toUpperCase()}. Tu contrôles l'appareil par la voix. Si l'utilisateur demande d'appeler ou d'ouvrir WhatsApp, utilise controlDevice. Sois directe et efficace.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Microphone inaccessible');
    }
  };

  const stopLive = () => {
    if (sessionRef.current) {
        try { sessionRef.current.close(); } catch {}
        sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('Mode Spécial prêt');
  };

  useEffect(() => {
    return () => { stopLive(); };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 bg-black/20">
      <div className="relative group">
        <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${
          isActive ? 'border-cyan-400 shadow-[0_0_80px_rgba(34,211,238,0.3)] scale-105' : 'border-white/10'
        }`}>
          <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
          <SharonIcon size="w-56 h-56 md:w-72 md:h-72" className={`${isActive ? 'opacity-100 brightness-110' : 'opacity-40 grayscale'}`} />
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-full h-full flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`absolute w-1 bg-cyan-400/40 rounded-full animate-pulse`} 
                         style={{ 
                           height: `${40 + Math.random() * 50}%`, 
                           transform: `rotate(${i * 30}deg) translateY(-100%)`,
                           animationDelay: `${i * 0.1}s`,
                           opacity: 0.3
                         }}></div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
           <ShieldCheck size={18} className="text-cyan-400" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Protocole HeadLights Activé</span>
        </div>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">{isActive ? 'Sharon à l\'écoute' : 'Contrôle Spécial'}</h2>
        <p className={`text-lg font-medium transition-colors ${isActive ? 'text-cyan-400 animate-pulse' : 'opacity-40'}`}>{status}</p>
      </div>

      <div className="flex space-x-6">
        {!isActive ? (
          <button
            onClick={startLive}
            className="group relative w-24 h-24 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center shadow-3xl shadow-cyan-500/40 transition-all hover:scale-110 active:scale-95 text-white"
          >
            <Cpu size={36} className="relative z-10" />
            <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-20 group-hover:opacity-40"></div>
          </button>
        ) : (
          <button
            onClick={stopLive}
            className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-3xl shadow-red-500/40 transition-all hover:scale-110 active:scale-95 text-white"
          >
            <PhoneOff size={36} />
          </button>
        )}
      </div>

      <div className="glass px-8 py-5 rounded-[2rem] flex items-center space-x-4 border border-white/5 max-w-md">
        <Activity size={24} className="text-cyan-400 animate-pulse" />
        <p className="text-xs text-left leading-relaxed font-bold opacity-60">
          Demander un service à Sharon<br/>
          <span className="text-cyan-400">Le système exécutera vos ordres instantanément ({userState.behavior}).</span>
        </p>
      </div>
    </div>
  );
};

export default LiveView;

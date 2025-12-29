
import React, { useState, useRef, useEffect } from 'react';
import { Plus, SendHorizontal } from 'lucide-react';
import { getSharonResponse, speakNotification } from '../services/geminiService';
import { ChatMessage, UserState } from '../types';
import GroundingLinks from './GroundingLinks';
import { SharonIcon } from './SharonIcon';

interface ChatViewProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  themeStyles: string;
}

const ChatView: React.FC<ChatViewProps> = ({ userState, setUserState, themeStyles }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bonjour ! Sharon est prête. Que souhaitez-vous faire aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getSharonResponse(input, userState.behavior, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Erreur système Sharon." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Lien neuronal défaillant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      <header className="px-6 py-4 flex justify-between items-center glass border-b border-white/5 pt-12 md:pt-4">
        <div className="flex items-center space-x-3">
          <SharonIcon size="w-8 h-8" />
          <h1 className="text-lg font-black tracking-tight">Sharon</h1>
        </div>
        <div className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-[9px] font-black uppercase tracking-widest text-cyan-400">
          {userState.behavior}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-[2rem] max-w-[88%] text-sm font-medium ${
              msg.role === 'user' 
                ? 'bg-cyan-500 text-white rounded-tr-none' 
                : 'glass text-white/90 rounded-tl-none border border-white/10'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="animate-pulse flex space-x-2 p-2"><div className="w-2 h-2 bg-cyan-400 rounded-full"></div><div className="w-2 h-2 bg-cyan-400 rounded-full"></div></div>}
      </div>

      <div className="p-4 pb-12 md:pb-8">
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-[2.5rem] p-1 glass">
          <button className="p-4 text-white/40"><Plus size={20} /></button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message à Sharon..."
            className="flex-1 bg-transparent py-4 text-sm focus:outline-none"
          />
          <button 
            onClick={handleSend} 
            className="p-3 bg-cyan-500 rounded-full text-white shadow-lg shadow-cyan-500/20 active:scale-90 transition-all flex items-center justify-center"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;

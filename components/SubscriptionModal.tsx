
import React from 'react';
import { Check, X, Star, Smartphone, CreditCard, Landmark } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
  isSubscribed: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onSubscribe, isSubscribed }) => {
  const localPaymentMethods = [
    { name: 'Orange Money', color: 'bg-[#FF6600]', type: 'Mobile Money' },
    { name: 'Airtel Money', color: 'bg-[#E11900]', type: 'Mobile Money' },
    { name: 'Rawbank (Illicocash)', color: 'bg-yellow-600', type: 'Banque RDC' },
    { name: 'Equity BCDC', color: 'bg-red-800', type: 'Banque RDC' },
    { name: 'Ecobank', color: 'bg-blue-800', type: 'Banque RDC' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg glass bg-gray-900/90 rounded-[40px] overflow-hidden border border-white/20 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="p-8 md:p-10 text-center space-y-6">
          <div className="inline-block p-4 rounded-3xl bg-amber-500/20 text-amber-500 mb-2">
            <Star size={40} fill="currentColor" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Sharon Premium</h2>
            <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px]">Disponible en RD Congo • Kinshasa</p>
          </div>

          <div className="space-y-3 text-left bg-white/5 p-6 rounded-3xl border border-white/5">
            {[
              'Générations illimitées (Photos & Vidéos)',
              'Accès exclusif à la création de Musique',
              'Mode Spécial Ops Voix HD',
              'Sans aucune publicité',
              'Support prioritaire HeadLights'
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check size={12} className="text-green-500" />
                </div>
                <span className="text-xs font-bold opacity-80">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Moyens de paiement acceptés (RDC)</p>
            <div className="grid grid-cols-2 gap-2">
              {localPaymentMethods.map((method, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 glass rounded-2xl border border-white/5 bg-white/5">
                  <div className={`w-2 h-2 rounded-full ${method.color}`}></div>
                  <div className="text-left">
                    <p className="text-[10px] font-black leading-none">{method.name}</p>
                    <p className="text-[8px] opacity-40 uppercase font-bold">{method.type}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center space-x-2 p-3 glass rounded-2xl border border-white/5 bg-white/5 opacity-60">
                <Smartphone size={14} className="text-cyan-400" />
                <div className="text-left">
                  <p className="text-[10px] font-black leading-none">M-Pesa</p>
                  <p className="text-[8px] uppercase font-bold">Bientôt</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-black italic">5$</span>
                <span className="opacity-60 text-sm font-bold uppercase tracking-widest">/ mois</span>
            </div>
            
            <button
              onClick={() => { onSubscribe(); onClose(); }}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] shadow-xl uppercase tracking-widest ${
                isSubscribed ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-amber-500/20'
              }`}
            >
              {isSubscribed ? 'Annuler l\'abonnement' : 'S\'abonner Maintenant'}
            </button>
            <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider">Propulsé par HeadLights.company • Solutions RDC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;

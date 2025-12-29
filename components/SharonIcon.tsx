
import React from 'react';

export const SharonIcon: React.FC<{ size?: string; className?: string }> = ({ size = "w-12 h-12", className = "" }) => {
  return (
    <div className={`${size} rounded-full flex items-center justify-center bg-gradient-to-tr from-cyan-600 to-blue-500 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] overflow-hidden relative ${className}`}>
      {/* Background patterns for a more premium look */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_0)] bg-[size:4px_4px]"></div>
      
      {/* The letters "Sh" scaled to fill the circle as much as possible */}
      <span className="text-white font-[900] italic tracking-tighter leading-none select-none flex items-center justify-center"
            style={{ 
              fontSize: '100%', 
              transform: 'scale(1.8) translateX(-2%)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
        Sh
      </span>
      
      {/* High-tech overlay flare */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

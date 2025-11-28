import React from 'react';
import { Power, PowerOff } from 'lucide-react';

interface VibrateButtonProps {
  isVibrating: boolean;
  onClick: () => void;
  disabled: boolean;
}

const VibrateButton: React.FC<VibrateButtonProps> = ({ isVibrating, onClick, disabled }) => {
  return (
    <div className="flex justify-center my-8 relative">
      {/* Background Glow Ring */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl transition-opacity duration-500 ${isVibrating ? 'bg-red-600/30 opacity-100' : 'opacity-0'}`} />

      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative z-10 w-40 h-40 rounded-full flex items-center justify-center border-4 transition-all duration-300
          ${disabled 
            ? 'border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed' 
            : isVibrating
              ? 'border-red-500 bg-zinc-900 text-red-500 animate-active-pulse shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-105'
              : 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:shadow-lg hover:scale-105 active:scale-95'
          }
        `}
      >
        <div className="flex flex-col items-center gap-2">
          {isVibrating ? (
            <Power className="w-12 h-12" />
          ) : (
            <PowerOff className="w-12 h-12" />
          )}
          <span className="text-sm font-semibold tracking-widest uppercase">
            {isVibrating ? 'ON' : 'OFF'}
          </span>
        </div>
      </button>
    </div>
  );
};

export default VibrateButton;
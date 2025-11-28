import React from 'react';
import { VibrationPattern } from '../types.ts';
import { Activity, Zap, Heart, Radio, AlertCircle, Shuffle } from 'lucide-react';

interface PatternCardProps {
  pattern: VibrationPattern;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern, isSelected, onSelect }) => {
  const getIcon = () => {
    switch (pattern.id) {
      case 'continuous': return <Zap className="w-5 h-5" />;
      case 'heartbeat': return <Heart className="w-5 h-5" />;
      case 'sos': return <AlertCircle className="w-5 h-5" />;
      case 'random': return <Shuffle className="w-5 h-5" />;
      case 'pulse-slow': return <Radio className="w-5 h-5" />;
      case 'pulse-fast': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={() => onSelect(pattern.id)}
      className={`
        relative overflow-hidden w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 text-left
        ${isSelected 
          ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
        }
      `}
    >
      <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
        {getIcon()}
      </div>
      <div>
        <h3 className={`font-semibold ${isSelected ? 'text-red-400' : 'text-zinc-200'}`}>
          {pattern.name}
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          {pattern.description}
        </p>
      </div>
      {isSelected && (
        <div className="absolute right-4 animate-pulse">
           <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
    </button>
  );
};

export default PatternCard;
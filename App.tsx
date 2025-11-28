import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VIBRATION_PATTERNS } from './constants';
import PatternCard from './components/PatternCard';
import VibrateButton from './components/VibrateButton';
import { Smartphone, AlertTriangle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isVibrating, setIsVibrating] = useState<boolean>(false);
  const [selectedPatternId, setSelectedPatternId] = useState<string>('continuous');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for vibration support
    if (typeof navigator === 'undefined' || !navigator.vibrate) {
      setIsSupported(false);
    }
  }, []);

  // Calculate total duration of a pattern sequence
  const getPatternDuration = (sequence: number[]): number => {
    return sequence.reduce((a, b) => a + b, 0);
  };

  const stopVibration = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVibrating(false);
  }, []);

  const startVibration = useCallback(() => {
    if (!isSupported) return;

    const pattern = VIBRATION_PATTERNS.find(p => p.id === selectedPatternId);
    if (!pattern) return;

    setIsVibrating(true);

    const playSequence = () => {
      let sequence = pattern.sequence;

      // Special handling for Random mode
      if (pattern.id === 'random') {
        sequence = Array.from({ length: 10 }, () => Math.floor(Math.random() * 400) + 50);
      }
      
      // Fallback for empty sequence
      if (sequence.length === 0) sequence = [200];

      // Execute vibration
      navigator.vibrate(sequence);

      // Loop logic
      // We need to schedule the next loop. 
      // Note: navigator.vibrate cancels previous calls, so we just call it again after duration.
      // However, browsers have limits. Continuous loops are best handled by re-triggering.
      
      const duration = getPatternDuration(sequence);
      // Add a small buffer to ensure the previous pattern finished effectively in the browser queue logic
      // or to prevent overlap if the browser clips it. 
      // For continuous (one long vibration), we just re-trigger.
      
      timerRef.current = window.setTimeout(playSequence, duration > 0 ? duration : 100);
    };

    playSequence();
  }, [isSupported, selectedPatternId]);

  const toggleVibration = () => {
    if (isVibrating) {
      stopVibration();
    } else {
      startVibration();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVibration();
    };
  }, [stopVibration]);

  // Handle pattern change
  const handlePatternSelect = (id: string) => {
    if (isVibrating) {
      stopVibration();
      // Optional: immediately start new pattern
      // setTimeout(() => { setSelectedPatternId(id); startVibration(); }, 50);
      // But standard UX is usually stop when changing settings.
    }
    setSelectedPatternId(id);
  };

  const currentPattern = VIBRATION_PATTERNS.find(p => p.id === selectedPatternId);

  return (
    <div className="min-h-screen flex flex-col items-center bg-zinc-950 text-white selection:bg-red-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="w-full max-w-md p-6 flex flex-col items-center border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="text-red-500 w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">VibeCheck</h1>
        </div>
        <p className="text-zinc-500 text-sm text-center">
          Web Vibration API Tester
        </p>
      </header>

      <main className="w-full max-w-md px-6 pt-8 flex-1 flex flex-col">
        
        {/* Warning for iOS/Desktop */}
        {!isSupported && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 items-start">
            <AlertTriangle className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-500 text-sm">Device Not Supported</h3>
              <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
                It looks like your browser or device doesn't support the Vibration API. This usually happens on iOS (iPhones/iPads) or desktop computers. Try using an Android phone with Chrome.
              </p>
            </div>
          </div>
        )}

        {/* Main Action */}
        <div className="flex flex-col items-center">
          <VibrateButton 
            isVibrating={isVibrating} 
            onClick={toggleVibration} 
            disabled={!isSupported}
          />
          
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest text-[10px] mb-2">Current Mode</p>
            <h2 className={`text-2xl font-bold transition-colors ${isVibrating ? 'text-red-500' : 'text-zinc-200'}`}>
              {currentPattern?.name || 'Select Pattern'}
            </h2>
            {isVibrating && (
              <p className="text-xs text-red-400 mt-2 animate-pulse">
                Vibrating...
              </p>
            )}
          </div>
        </div>

        {/* Pattern List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Patterns</span>
             <Info className="w-3 h-3 text-zinc-700" />
          </div>
          
          <div className="grid gap-3 pb-8">
            {VIBRATION_PATTERNS.map((pattern) => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                isSelected={selectedPatternId === pattern.id}
                onSelect={handlePatternSelect}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-zinc-700 text-xs">
        <p>Use responsibly. Battery usage may increase.</p>
      </footer>
    </div>
  );
};

export default App;
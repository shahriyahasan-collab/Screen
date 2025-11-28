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
  const hasTriedAutoStart = useRef<boolean>(false);

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
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(0);
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVibrating(false);
  }, []);

  // Modified to return success boolean
  const startVibration = useCallback((): boolean => {
    // Robust check for support
    if (typeof navigator === 'undefined' || !navigator.vibrate) {
      setIsSupported(false);
      return false;
    }

    const pattern = VIBRATION_PATTERNS.find(p => p.id === selectedPatternId);
    if (!pattern) return false;

    // Helper to generate sequence (needed for random mode)
    const getSequence = () => {
      if (pattern.id === 'random') {
        return Array.from({ length: 10 }, () => Math.floor(Math.random() * 400) + 50);
      }
      return pattern.sequence.length > 0 ? pattern.sequence : [200];
    };

    // Recursive function for looping vibration
    const runVibrationLoop = () => {
      if (!timerRef.current && !isVibrating) return; // Guard clause if stopped in between

      const sequence = getSequence();
      navigator.vibrate(sequence);
      const duration = getPatternDuration(sequence);
      timerRef.current = window.setTimeout(runVibrationLoop, duration > 0 ? duration : 100);
    };

    // Attempt the first vibration immediately
    const initialSequence = getSequence();
    const success = navigator.vibrate(initialSequence);

    // Note: success may be true even if blocked by lack of gesture on some browsers.
    // However, if we are in a gesture context, this will work.

    // Update UI
    setIsVibrating(true);
    
    // Clear any existing timer just in case
    if (timerRef.current) clearTimeout(timerRef.current);

    // Schedule next loop
    const duration = getPatternDuration(initialSequence);
    timerRef.current = window.setTimeout(runVibrationLoop, duration > 0 ? duration : 100);
    return true;

  }, [selectedPatternId, isVibrating]);

  // Auto-start effect: Waits for FIRST interaction to trigger.
  // This solves the "It says ON but isn't vibrating" bug by ensuring we have a user gesture.
  useEffect(() => {
    if (!hasTriedAutoStart.current && isSupported) {
      hasTriedAutoStart.current = true;
      
      const handleInteraction = () => {
        // Only auto-start if we aren't already vibrating
        if (!timerRef.current) {
          startVibration();
        }
        // Clean up listeners immediately after first valid interaction
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };

      // We do NOT try to vibrate immediately on mount because it usually fails silently 
      // and desyncs the UI. Instead, we strictly wait for the first tap.
      document.addEventListener('click', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);
      document.addEventListener('keydown', handleInteraction);
    }
  }, [isSupported, startVibration]);

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
            {isVibrating ? (
              <p className="text-xs text-red-400 mt-2 animate-pulse">
                Vibrating...
              </p>
            ) : (
              <p className="text-xs text-zinc-600 mt-2">
                Tap anywhere to start
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
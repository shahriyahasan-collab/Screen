import { VibrationPattern } from './types.ts';

export const VIBRATION_PATTERNS: VibrationPattern[] = [
  {
    id: 'continuous',
    name: 'Continuous',
    sequence: [10000], // Long vibration, will be looped
    description: 'Steady, uninterrupted vibration'
  },
  {
    id: 'pulse-slow',
    name: 'Slow Pulse',
    sequence: [500, 500],
    description: 'Rhythmic slow pulsing'
  },
  {
    id: 'pulse-fast',
    name: 'Fast Pulse',
    sequence: [200, 200],
    description: 'Rapid, energetic pulsing'
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    sequence: [100, 100, 100, 800],
    description: 'Mimics a human heartbeat'
  },
  {
    id: 'sos',
    name: 'S.O.S.',
    sequence: [
      100, 100, 100, 100, 100, 100, // ...
      300, 100, 300, 100, 300, 100, // ---
      100, 100, 100, 100, 100, 100  // ...
    ],
    description: 'Standard distress signal'
  },
  {
    id: 'random',
    name: 'Randomizer',
    sequence: [], // Special handled in logic
    description: 'Chaotic, random patterns'
  }
];
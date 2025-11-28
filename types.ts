export interface VibrationPattern {
  id: string;
  name: string;
  sequence: number[]; // Array of times in ms [vibrate, pause, vibrate, pause...]
  description: string;
}

export interface AppState {
  isVibrating: boolean;
  selectedPatternId: string;
  isSupported: boolean;
}
// src/lib/redux/slices/teenPattiSlice.ts

import { GameConfig, GamePhase, GameResult, PotData, TimerData, UserData } from '@/lib/dto/teenpatti.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeenPattiState {
  // Game configuration
  config: GameConfig | null;
  gameId: number;
  tableId: string;
  
  // Timer & Phase
  currentPhase: GamePhase;
  timerData: TimerData | null;
  timerRemaining: number;
  
  // Betting
  selectedCoin: number | null;
  
  // Pots
  pots: PotData[];
  
  // Players
  players: UserData[];
  
  // Result
  result: GameResult | null;
  showResultModal: boolean;
  
  // UI State
  soundEnabled: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: TeenPattiState = {
  config: null,
  gameId: 16,
  tableId: 'table_16',
  
  currentPhase: 'waiting',
  timerData: null,
  timerRemaining: 0,
  
  selectedCoin: null,
  
  pots: [],
  players: [],
  
  result: null,
  showResultModal: false,
  
  soundEnabled: true,
  loading: false,
  error: null,
};

const teenPattiSlice = createSlice({
  name: 'teenPatti',
  initialState,
  reducers: {
    // Configuration
    setConfig: (state, action: PayloadAction<GameConfig>) => {
      state.config = action.payload;
      state.loading = false;
    },
    
    // Timer
    updateTimer: (state, action: PayloadAction<TimerData>) => {
      state.timerData = action.payload;
      state.timerRemaining = action.payload.remaining;
      
      // Update phase based on timer phase
      if (action.payload.phase === 'bettingTimer') {
        state.currentPhase = 'betting';
      } else if (action.payload.phase === 'winningCalculationTimer') {
        state.currentPhase = 'calculation';
      } else if (action.payload.phase === 'resultAnnounceTimer') {
        state.currentPhase = 'result';
      } else if (action.payload.phase === 'newGameStartTimer') {
        state.currentPhase = 'waiting';
      }
    },
    
    // Coin Selection
    selectCoin: (state, action: PayloadAction<number | null>) => {
      state.selectedCoin = action.payload;
    },
    
    // Pots
    updatePots: (state, action: PayloadAction<PotData[]>) => {
      state.pots = action.payload;
    },
    
    // Players
    updatePlayers: (state, action: PayloadAction<UserData[]>) => {
      state.players = action.payload;
    },
    
    // Result
    setResult: (state, action: PayloadAction<GameResult>) => {
      state.result = action.payload;
      state.showResultModal = true;
    },
    
    closeResultModal: (state) => {
      state.showResultModal = false;
    },
    
    clearResult: (state) => {
      state.result = null;
      state.showResultModal = false;
    },
    
    // Round Reset
    resetRound: (state) => {
      state.selectedCoin = null;
      state.result = null;
      state.showResultModal = false;
      state.currentPhase = 'waiting';
    },
    
    // Sound
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    
    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConfig,
  updateTimer,
  selectCoin,
  updatePots,
  updatePlayers,
  setResult,
  closeResultModal,
  clearResult,
  resetRound,
  toggleSound,
  setSoundEnabled,
  setLoading,
  setError,
} = teenPattiSlice.actions;

export default teenPattiSlice.reducer;
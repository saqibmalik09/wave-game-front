import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameConfig {
  gameId: number;
  bettingCoins?: number[];
  cardImages?: string[][];
  cardBackImages?: string[][];
  dealerAvatar?: string;
  tableBackgroundImage?: string;
  betButtonAndCardClickSound?: string;
  timerUpSound?: string;
  cardsShuffleSound?: string;
  returnWinngingPotPercentage?: number[];
  colors?: string[];
  winningCalculationTime?: number;
  BettingTime?: number;
  nextBetWait?: number;
  [key: string]: any; // allows other future game configs (for other gameIds)
}

interface GameConfigState {
  loading: boolean;
  error: string | null;
  configs: Record<number, GameConfig>; // supports multiple gameIds (e.g. 16, 20, etc.)
}

const initialState: GameConfigState = {
  loading: false,
  error: null,
  configs: {},
};

const gameConfigSlice = createSlice({
  name: "gameConfig",
  initialState,
  reducers: {
    gameConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    gameConfigSuccess: (state, action: PayloadAction<GameConfig>) => {
      state.loading = false;
      state.error = null;
      const { gameId } = action.payload;
      state.configs[gameId] = action.payload; // store per gameId
    },
    gameConfigFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetGameConfig: (state, action: PayloadAction<number | undefined>) => {
      if (action.payload) {
        delete state.configs[action.payload];
      } else {
        state.configs = {};
      }
    },
  },
});

export const {
  gameConfigRequest,
  gameConfigSuccess,
  gameConfigFailure,
  resetGameConfig,
} = gameConfigSlice.actions;

export default gameConfigSlice.reducer;

'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TeenpattiTimerState {
  phase: string | null;      // e.g. "betting", "result", "waiting"
  remainingTime: number | 0; // seconds left
  totalTime?: number | 0;    // optional: full duration of phase
  lastUpdated?: number;      // timestamp of last event
}

const initialState: TeenpattiTimerState = {
  phase: null,
  remainingTime: 0,
  totalTime: 0,
  lastUpdated: Date.now(),
};

const teenpattiTimerSlice = createSlice({
  name: 'teenpattiTimer',
  initialState,
  reducers: {
    updateTimer: (state, action: PayloadAction<Partial<TeenpattiTimerState>>) => {
      Object.assign(state, action.payload);
      state.lastUpdated = Date.now();
    },
    resetTimer: (state) => {
      state.phase = null;
      state.remainingTime = 0;
      state.totalTime = 0;
      state.lastUpdated = Date.now();
    },
  },
});

export const { updateTimer, resetTimer } = teenpattiTimerSlice.actions;
export default teenpattiTimerSlice.reducer;

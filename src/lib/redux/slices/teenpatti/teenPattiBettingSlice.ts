"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FastBet {
  userId: string;
  amount: number;      // coin (50,100,500...)
  tableId: number;    // which pot clicked
  betType: string;    // e.g., '1' for normal bet, '2' for side bet etc.
}

interface BetState {
  lastBet?: FastBet; // only latest click event
}

const initialState: BetState = {
  lastBet: undefined,
};

const teenPattiBettingSlice = createSlice({
  name: "teenPattiBetting",
  initialState,
  reducers: {
    placeBet: (state, action: PayloadAction<FastBet>) => {
      state.lastBet = action.payload; // just store latest bet
    },

    /** Clear last bet (optional) */
    clearBet: (state) => {
      state.lastBet = undefined;
    },
  },
});

export const { placeBet, clearBet } = teenPattiBettingSlice.actions;
export default teenPattiBettingSlice.reducer;

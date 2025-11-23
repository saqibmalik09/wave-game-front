import { createSlice } from "@reduxjs/toolkit";

interface WinningPotState {
  winningPotIndex: number | null;
}

const initialState: WinningPotState = {
  winningPotIndex: null,
};

const winningPotSlice = createSlice({
  name: "winningPot",
  initialState,
  reducers: {
    setWinningPotIndex: (state, action) => {
      state.winningPotIndex = action.payload;
    },
    clearWinningPot: (state) => {
      state.winningPotIndex = null;
    }
  },
});

export const { setWinningPotIndex, clearWinningPot } = winningPotSlice.actions;
export default winningPotSlice.reducer;

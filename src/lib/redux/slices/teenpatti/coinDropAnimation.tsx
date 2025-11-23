import { createSlice } from "@reduxjs/toolkit";

const coinAnimationSlice = createSlice({
  name: "coinAnimation",
  initialState: {
    pendingCoin: null, 
  },
  reducers: {
    setPendingCoin(state, action) {
      state.pendingCoin = action.payload;
    },
    clearPendingCoin(state) {
      state.pendingCoin = null;
    }
  }
});

export const { setPendingCoin, clearPendingCoin } = coinAnimationSlice.actions;
export default coinAnimationSlice.reducer;

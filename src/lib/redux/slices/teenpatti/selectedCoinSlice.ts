import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedCoin {
  amount: number;
  color: string;
}

interface CoinState {
  coin: SelectedCoin | null;
}

const initialState: CoinState = {
  coin: null,
};

const selectedCoinSlice = createSlice({
  name: "selectedCoin",
  initialState,
  reducers: {
    setCoin: (state, action: PayloadAction<SelectedCoin>) => {
      state.coin = action.payload;
    },
  },
});

export const { setCoin } = selectedCoinSlice.actions;
export default selectedCoinSlice.reducer;

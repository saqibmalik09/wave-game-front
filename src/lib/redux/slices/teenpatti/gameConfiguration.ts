// gameConfigurationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigurationState {
  data: any;
}

const initialState: ConfigurationState = {
  data: null,
};

const gameConfigurationSlice = createSlice({
  name: "gameConfiguration",
  initialState,
  reducers: {
    setGameConfiguration: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { setGameConfiguration } = gameConfigurationSlice.actions;
export default gameConfigurationSlice.reducer;

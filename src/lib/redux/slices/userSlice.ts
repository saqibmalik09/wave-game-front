// src/redux/slices/userInfoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the user info
export interface UserPlayerInfo {
  id: string;
  name: string;
  balance: number;
  profilePicture: string;
}

// Define the slice state
export interface UserPlayerInfoState {
  success: boolean | null;  // null until first fetch
  message: string | null;
  data: UserPlayerInfo | null;
}

const initialState: UserPlayerInfoState = {
  success: null,
  message: null,
  data: null,
};

const userPlayerInfoSlice = createSlice({
  name: "userPlayerInfo",
  initialState,
  reducers: {
    setUserPlayerInfo: (state, action: PayloadAction<UserPlayerInfoState>) => {
      state.success = action.payload.success;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
    clearUserPlayerInfo: (state) => {
      state.success = null;
      state.message = null;
      state.data = null;
    },
  },
});

export const { setUserPlayerInfo, clearUserPlayerInfo } = userPlayerInfoSlice.actions;
export default userPlayerInfoSlice.reducer;

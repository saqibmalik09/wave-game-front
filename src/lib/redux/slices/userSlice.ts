// src/redux/slices/userInfoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserPlayerInfo {
  id: string;
  name: string;
  balance: number;
  profilePicture: string;
}

export interface UserPlayerInfoState {
  success: boolean | null;
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

    // ✅ NEW: balance-only update
    updateUserBalance: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.balance = action.payload;
      }
    },

    // ✅ OPTIONAL: increment / decrement
    incrementUserBalance: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.balance += action.payload;
      }
    },

    clearUserPlayerInfo: (state) => {
      state.success = null;
      state.message = null;
      state.data = null;
    },
  },
});

export const {
  setUserPlayerInfo,
  updateUserBalance,
  incrementUserBalance,
  clearUserPlayerInfo,
} = userPlayerInfoSlice.actions;

export default userPlayerInfoSlice.reducer;

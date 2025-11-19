'use client';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  userId: number | null;
  name: string;
  imageProfile?: string;
  balance: number;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    userDataSuccess: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.loading = false;
    },
    userDataFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserBalance: (state, action: PayloadAction<number>) => {
      if (state.user) state.user.balance = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { userDataRequest, userDataSuccess, userDataFailure, updateUserBalance, logout } =
  userSlice.actions;
export default userSlice.reducer;

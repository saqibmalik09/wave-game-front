import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ApplicationInfo {
  socketId: string;
  // You can add more fields later, e.g.:
  // deviceId?: string;
  // sessionId?: string;
  // version?: string;
}

interface ApplicationState {
  applicationInfo: ApplicationInfo | null;
}

const initialState: ApplicationState = {
  applicationInfo: null,
};

const applicationInfoSlice = createSlice({
  name: "applicationInfo",
  initialState,
  reducers: {
    setApplicationInfo: (
      state,
      action: PayloadAction<ApplicationInfo>
    ) => {
      state.applicationInfo = action.payload;
    },
    updateApplicationInfo: (
      state,
      action: PayloadAction<Partial<ApplicationInfo>>
    ) => {
      if (state.applicationInfo) {
        state.applicationInfo = {
          ...state.applicationInfo,
          ...action.payload,
        };
      }
    },
    clearApplicationInfo: (state) => {
      state.applicationInfo = null;
    },
  },
});

export const {
  setApplicationInfo,
  updateApplicationInfo,
  clearApplicationInfo,
} = applicationInfoSlice.actions;

export default applicationInfoSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userPlayerInfoReducer from "./slices/userSlice";
import gameConfigReducer from "./slices/gameConfigSlice";
import teenpattiTimerReducer from './slices/teenpatti/teenpattiTimerSlice';
import teenPattiBettingReducer from "./slices/teenpatti/teenPattiBettingSlice";
import selectedCoinReducer from "./slices/teenpatti/selectedCoinSlice";
import gameConfigurationReducer from "./slices/teenpatti/gameConfiguration";
import tenantDetailsReducer from "./slices/tenantDetails";
import coinAnimationReducer from "./slices/teenpatti/coinDropAnimation";
import applicationInfoReducer from "./slices/applicationInfoSlice";
import winningPotReducer from "./slices/teenpatti/winningPotSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userPlayerData: userPlayerInfoReducer,
    gameConfig: gameConfigReducer,
    teenpattiTimer: teenpattiTimerReducer,
    teenPattiBettingReducer: teenPattiBettingReducer,
    selectedCoin: selectedCoinReducer,
    gameConfiguration: gameConfigurationReducer,
    tenantDetails: tenantDetailsReducer,
    coinAnimation: coinAnimationReducer,
    applicationInfo: applicationInfoReducer,
    winningPot: winningPotReducer,



  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

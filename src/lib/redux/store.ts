import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import gameConfigReducer from "./slices/gameConfigSlice";
import teenpattiTimerReducer from './slices/teenpatti/teenpattiTimerSlice';
import teenPattiBettingReducer from "./slices/teenpatti/teenPattiBettingSlice";
import selectedCoinReducer from "./slices/teenpatti/selectedCoinSlice";
import gameConfigurationReducer from "./slices/teenpatti/gameConfiguration";


export const store = configureStore({
  reducer: {
    user: userReducer,
    gameConfig: gameConfigReducer,
    teenpattiTimer: teenpattiTimerReducer,
    teenPattiBettingReducer:teenPattiBettingReducer,
    selectedCoin: selectedCoinReducer,
    gameConfiguration: gameConfigurationReducer,


  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

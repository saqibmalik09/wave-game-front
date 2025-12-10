import { createSlice } from "@reduxjs/toolkit";

const bootstrapSlice = createSlice({
  name: "bootstrap",
  initialState: {
    ready: false,     // when true → socket can initialize
    urlParamsLoaded: false,
    tenantLoaded: false,
    userLoaded: false,
    gameConfigLoaded: false,
  },
  reducers: {
    markUrlParamsLoaded(state) {
      state.urlParamsLoaded = true;
    },
    markTenantLoaded(state) {
      state.tenantLoaded = true;
    },
    markUserLoaded(state) {
      state.userLoaded = true;
    },
    markGameConfigLoaded(state) {
      state.gameConfigLoaded = true;
    },
    setReady(state, action) {
      state.ready = action.payload;
    }
  }
});

export const {
  markUrlParamsLoaded,
  markTenantLoaded,
  markUserLoaded,
  markGameConfigLoaded,
  setReady
} = bootstrapSlice.actions;

export default bootstrapSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TenantState {
  data: any | null;
}

const initialState: TenantState = {
  data: null,
};

const tenantDetailsSlice = createSlice({
  name: "tenantDetails",
  initialState,
  reducers: {
    setTenantDetails: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    clearTenantDetails: (state) => {
      state.data = null;
    },
  },
});

export const { setTenantDetails, clearTenantDetails } =
  tenantDetailsSlice.actions;

export default tenantDetailsSlice.reducer;

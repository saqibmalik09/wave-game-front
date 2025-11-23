// tenantDetails.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TenantState {
  data: any;
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
  },
});

export const { setTenantDetails } = tenantDetailsSlice.actions;
export default tenantDetailsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
const authenticationslice = createSlice({
  name: "authentication",
  initialState: {
    value: false,
  },
  reducers: {
    toggleauthentication: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { toggleauthentication } = authenticationslice.actions;
export default authenticationslice.reducer;

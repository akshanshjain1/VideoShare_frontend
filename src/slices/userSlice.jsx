import { createSlice } from "@reduxjs/toolkit";
const userslice = createSlice({
  name: "user",
  initialState: {
    value: {},
  },
  reducers: {
    uservalue: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { uservalue } = userslice.actions;
export default userslice.reducer;

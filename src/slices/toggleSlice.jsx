import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const toggleslice = createSlice({
  name: "toggle",
  initialState: {
    value:
      Cookies.get("mode") === undefined
        ? false
        : JSON.parse(Cookies.get("mode")),
  },
  reducers: {
    togglevalue: (state, action) => {
      if (action.payload !== undefined) {
        state.value = action.payload;
      } else {
        state.value = !state.value;
      }
    },
  },
});
export const { togglevalue } = toggleslice.actions;
export default toggleslice.reducer;

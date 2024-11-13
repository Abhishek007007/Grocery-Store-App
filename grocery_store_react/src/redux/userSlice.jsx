import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    email: "",
    access_token: Cookies.get("access"),
    refresh_token: Cookies.get("refresh"),
    isLoggedIn: false,
  },
  reducers: {
    set_data: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes.
    //   // Also, no return statement is required from these functions.
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { set_data } = userSlice.actions;

export default userSlice.reducer;

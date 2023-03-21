import { configureStore } from "@reduxjs/toolkit";
import profileDetailSlice from "./REDUX/profileDetailSlice";

export const store = configureStore({
  reducer: {
    profileDetailSlice: profileDetailSlice,
  },
});

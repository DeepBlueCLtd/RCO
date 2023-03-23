import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  adminRights: "",
  //@ts-ignore
  isLoggedin: JSON.parse(localStorage.getItem("isLoggedin")) || false,
};

const profileDetailSlice = createSlice({
  name: "profiledetails",
  initialState,
  reducers: {
    setProfileDetails(state, action) {
      state = Object.assign(state, action.payload);
    },
  },
});
export const { setProfileDetails } = profileDetailSlice.actions;
export default profileDetailSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./types";
import { RootState } from "../store";
import { User } from "../../models/user";
import { checkUserIsAuth } from "../../adapters/localStorageAdapter";

const initialState: UserState = {
  username: "",
  isAuth: checkUserIsAuth(),
};

const userInfo = createSlice({
  name: "useInfo",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      const { username } = action.payload;
      state.username = username;
      state.isAuth = true;
    },
    logOut: (state) => {
      state.username = null;
      state.isAuth = false;
    },
  },
});

export const { setUserData, logOut } = userInfo.actions;

export const isUserAuthSelector = (state: RootState) => state.user.isAuth;

export default userInfo.reducer;

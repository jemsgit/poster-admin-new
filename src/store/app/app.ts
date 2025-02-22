import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./types";

const initialState: AppState = {
  alert: null,
};

const appInfo = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

export default appInfo.reducer;

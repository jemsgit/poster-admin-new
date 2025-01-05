import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import userReducer from "./user/user";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

function createStore() {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
}

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

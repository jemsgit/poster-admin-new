import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import userReducer from "./user/user";
import editorReducer from "./editor/editor";
import appReducer from "./app/app";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

function createStore() {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      user: userReducer,
      editor: editorReducer,
      app: appReducer,
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

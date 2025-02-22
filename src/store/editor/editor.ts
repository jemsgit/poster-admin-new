import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorState } from "./types";
import {
  ContentType,
  LoadImageConfig,
  PostingType,
} from "../../models/channel";

const initialState: EditorState = {
  text: "",
  type: undefined, // links, video
  loadImage: false,
  contentType: undefined, // draft, main, ....
};

const editor = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setContentParams: (
      state,
      action: PayloadAction<{
        type: PostingType;
        loadImage: LoadImageConfig;
        contentType: ContentType;
      }>
    ) => {
      const { contentType, type, loadImage } = action.payload;
      state.contentType = contentType;
      state.type = type;
      state.loadImage = loadImage || false;
    },
    setCurrentPostData: (
      state,
      action: PayloadAction<{
        text: string;
      }>
    ) => {
      const { text } = action.payload;
      state.text = text;
    },
    clearCurrentPost: (state) => {
      state.text = "";
    },
    clearContentParams: (state) => {
      state.contentType = undefined;
      state.type = undefined;
      state.loadImage = false;
    },
  },
});

export const {
  setContentParams,
  setCurrentPostData,
  clearCurrentPost,
  clearContentParams,
} = editor.actions;

export default editor.reducer;

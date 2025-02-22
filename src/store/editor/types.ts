import {
  ContentType,
  LoadImageConfig,
  PostingType,
} from "../../models/channel";

export interface EditorState {
  text?: string;
  type?: PostingType;
  loadImage: LoadImageConfig;
  contentType?: ContentType;
}

export interface SuggestionSuccessResponse {
  answer: string | null;
  usage: number;
}

export interface SuggestionErrorResponse {
  error: boolean;
  description: string;
}

export interface SuggestionRequestBody {
  question: string;
}

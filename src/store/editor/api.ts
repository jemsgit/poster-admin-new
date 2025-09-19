import endpoints from "../../config/endpoints";
import api from "../api";
import { SuggestionRequestBody, SuggestionSuccessResponse } from "./types";

export const suggestionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ask: builder.mutation<SuggestionSuccessResponse, SuggestionRequestBody>({
      query: (suggestionPrompt) => {
        return {
          url: endpoints.suggestions.ask,
          method: "POST",
          body: suggestionPrompt,
        };
      },
    }),
    fetchImages: builder.query<
      {
        images: { url: string; base64: string }[];
        article: string;
        description?: string;
      },
      string
    >({
      query: (url) => ({
        url: `${
          endpoints.utils.images.getImageAndInfo
        }?url=${encodeURIComponent(url)}`,
      }),
    }),
  }),
});

export const { useAskMutation, useLazyFetchImagesQuery } = suggestionApi;

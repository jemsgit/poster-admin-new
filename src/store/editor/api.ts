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
  }),
});

export const { useAskMutation } = suggestionApi;

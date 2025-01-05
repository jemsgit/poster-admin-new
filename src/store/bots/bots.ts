import endpoints from "../../config/endpoints";
import { Bot } from "../../models/bot";
import api from "../api";

export const botsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    bots: builder.query<Bot[], void>({
      query: () => {
        return {
          url: endpoints.bots.get,
        };
      },
    }),
    botById: builder.query<Bot, string>({
      query: (botname) => {
        return {
          url: endpoints.bots.getSingle.replace(":id", botname),
        };
      },
    }),
  }),
});

export const { useBotsQuery, useBotByIdQuery } = botsApi;

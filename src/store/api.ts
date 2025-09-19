// Need to use the React-specific entry point to import createApi
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import endpoints from "../config/endpoints";
import { logOut } from "./user/user";
import { setUserIsAuth } from "../adapters/localStorageAdapter";

export const apiTags = ["Channels", "Bots", "Grabbers"];

const baseUrl = import.meta.env.BASE_URL || "/";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: endpoints.login.refresh,
        method: "GET",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
      setUserIsAuth(false);
    }
  }

  return result;
};

const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: apiTags,
});

export default api;

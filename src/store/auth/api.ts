import endpoints from "../../config/endpoints";
import { User } from "../../models/user";
import { LoginFormData } from "../../pages/Login/types";
import api from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginFormData>({
      query: (userData) => {
        return {
          url: endpoints.login.post,
          method: "POST",
          body: userData,
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;

import endpoints from "../../config/endpoints";
import { Grabber } from "../../models/grabber";
import api from "../api";

export const grabbersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    grabbers: builder.query<Grabber[], void>({
      query: () => {
        return {
          url: endpoints.grabbers.get,
        };
      },
    }),
    grabberById: builder.query<Grabber, string>({
      query: (grabberId) => {
        return {
          url: endpoints.grabbers.getSingle.replace(":id", grabberId),
        };
      },
    }),
  }),
});

export const { useGrabbersQuery, useGrabberByIdQuery } = grabbersApi;

import endpoints from "../../config/endpoints";
import { Channel, ContentInfo } from "../../models/channel";
import { GrabberInfo } from "../../models/grabber";
import api from "../api";

export const channelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    channels: builder.query<Channel[], void>({
      query: () => {
        return {
          url: endpoints.channels.get,
        };
      },
      providesTags: ["Channels"],
    }),
    channelById: builder.query<Channel, string>({
      query: (channelName) => {
        return {
          url: endpoints.channels.getSingle.replace(":id", channelName),
        };
      },
    }),
    updateChannel: builder.mutation<
      void,
      { channelInfo: Partial<Channel>; channelId: string }
    >({
      query: (data) => ({
        url: endpoints.channels.update.replace(":id", data.channelId),
        method: "PATCH",
        data: data.channelInfo,
      }),
    }),
    saveContent: builder.mutation<
      void,
      { content: string; channelId: string; type: string }
    >({
      query: (body) => ({
        url: endpoints.channels.saveContent,
        method: "PATCH",
        body,
        responseHandler: (response) => response.text(),
      }),
      transformResponse: () => undefined,
    }),
    getContent: builder.query<string, { channelId: string; type: string }>({
      query: ({ channelId, type }) => ({
        url: endpoints.channels.getContent,
        params: { channelId, type },
      }),
      transformResponse: (data: ContentInfo) => data.content,
    }),
    copyContent: builder.mutation<
      void,
      { content: string; channelId: string; sourceType: string }
    >({
      query: (body) => ({
        url: endpoints.channels.copyContent
          .replace(":id", body.channelId)
          .replace(":type", body.sourceType),
        method: "PATCH",
        body,
        responseHandler: (response) => response.text(),
      }),
    }),
    grabbersInfo: builder.query<GrabberInfo, string>({
      query: (channelId) => ({
        url: endpoints.grabbers.getSingle.replace(":id", channelId),
      }),
    }),
    testGrabber: builder.mutation<{ content: string }, { channelId: string }>({
      query: (body) => ({
        url: endpoints.grabbers.testGrabber.replace(":id", body.channelId),
        method: "POST",
      }),
    }),
  }),
});

export const {
  useChannelsQuery,
  useChannelByIdQuery,
  useSaveContentMutation,
  useUpdateChannelMutation,
  useGetContentQuery,
  useCopyContentMutation,
  useGrabbersInfoQuery,
  useTestGrabberMutation,
} = channelsApi;

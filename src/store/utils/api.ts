import endpoints from "../../config/endpoints";
import { Image } from "../../models/image";
import { Prompt } from "../../models/prompt";
import api from "../api";

export const utilsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    images: builder.query<Image[], void>({
      query: () => {
        return {
          url: endpoints.utils.images.get,
        };
      },
      providesTags: ["Images"],
    }),
    uploadImage: builder.mutation<void, File>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data);
        return {
          url: endpoints.utils.images.upload,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
    deleteImage: builder.mutation<void, { imageId: string }>({
      query: (body) => ({
        url: endpoints.utils.images.delete.replace(":id", body.imageId),
        method: "DELETE",
        body,
      }),
      transformResponse: () => undefined,
    }),
    prompts: builder.query<Prompt[], void>({
      query: () => {
        return {
          url: endpoints.utils.prompts.get,
        };
      },
      providesTags: ["Prompts"],
    }),
    addPrompt: builder.mutation<void, { text: Prompt["text"] }>({
      query: (data) => ({
        url: endpoints.utils.prompts.add,
        method: "POST",
        body: { text: data.text },
      }),
    }),
    deletePrompt: builder.mutation<void, { propmtId: string }>({
      query: (body) => ({
        url: endpoints.utils.prompts.delete.replace(":id", body.propmtId),
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useImagesQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
  usePromptsQuery,
  useAddPromptMutation,
  useDeletePromptMutation,
} = utilsApi;

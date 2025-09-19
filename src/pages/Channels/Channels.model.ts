import { store } from "../../store/store";

import { channelsApi } from "../../store/channels/api";
import { ChannelData } from "./types";
import { RouterLoader } from "../../routes/routes.types";

const loader = async (): Promise<RouterLoader<ChannelData>> => {
  const channelsQuery = store.dispatch(
    channelsApi.endpoints.channels.initiate()
  );

  const data = channelsQuery.then((res) => {
    return {
      channels: res.data,
    };
  });

  return {
    data: data,
  };
};

const handle = {
  breadcrumbs: [
    {
      title: "Main",
      url: "/",
    },
    {
      title: "Channels",
    },
  ],
};

export default {
  loader,
  handle,
};

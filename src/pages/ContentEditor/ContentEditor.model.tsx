import { LoaderFunctionArgs, Params } from "react-router-dom";
import { channelsApi } from "../../store/channels/api";
import { store } from "../../store/store";
import { RouterLoader } from "../../routes/routes.types";
import { ContentEditData } from "./types";
import { mapChannelsToTargets } from "../../adapters/channelsApiAdapter";

const loader = async (
  loaderParams: LoaderFunctionArgs
): Promise<RouterLoader<ContentEditData>> => {
  const channelQuery = store.dispatch(
    channelsApi.endpoints.channelById.initiate(
      loaderParams.params.name as string
    )
  );

  const channelsQuery = store.dispatch(
    channelsApi.endpoints.channels.initiate()
  );

  const channelContentQuery = store.dispatch(
    channelsApi.endpoints.getContent.initiate({
      channelId: loaderParams.params.name as string,
      type: loaderParams.params.type as string,
    })
  );

  const data = Promise.all([
    channelQuery,
    channelContentQuery,
    channelsQuery,
  ]).then((res) => {
    const channel = res[0].data;
    const content = res[1].data;
    const targetsToCopy = mapChannelsToTargets(res[2].data || []);
    return {
      channel,
      content,
      targetsToCopy,
    };
  });

  return {
    data,
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
      url: "/channels",
    },
  ],
  extraBreadcrumbs: (routerParams: Readonly<Params<string>>) => {
    return [
      {
        title: "Channel",
        url: `/channels/${routerParams.name}`,
      },
      {
        title: "ChannelContent",
        url: `/channels/content-edit/${routerParams.name}/${routerParams.type}`,
      },
    ];
  },
};

export default { loader, handle };

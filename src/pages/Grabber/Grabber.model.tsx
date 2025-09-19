import { LoaderFunctionArgs, Params } from "react-router-dom";
import { channelsApi } from "../../store/channels/api";
import { store } from "../../store/store";

const loader = async (loaderParams: LoaderFunctionArgs) => {
  const channelId = loaderParams.params.channelId as string;
  const grabberQuery = store
    .dispatch(channelsApi.endpoints.grabbersInfo.initiate(channelId as string))
    .then((res) => res.data);
  return {
    data: grabberQuery,
  };
};

const handle = {
  breadcrumbs: [
    {
      title: "Main",
      url: "/",
    },
    {
      title: "Grabber",
      url: "/grabbers",
    },
  ],
  extraBreadcrumbs: (routerParams: Readonly<Params<string>>) => {
    return [
      {
        title: "Grabber",
        url: `/grabbers/${routerParams.channelId}`,
      },
    ];
  },
};

export default { loader, handle };

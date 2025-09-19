import { LoaderFunctionArgs, Params } from "react-router-dom";
import { channelsApi } from "../../store/channels/api";
import { store } from "../../store/store";

const loader = (loaderParams: LoaderFunctionArgs) => {
  const channelsQuery = store
    .dispatch(
      channelsApi.endpoints.channelById.initiate(
        loaderParams.params.name as string
      )
    )
    .then((res) => res.data);
  return {
    data: channelsQuery,
  };
};

const handle = {
  breadcrumbs: [
    {
      title: "Main",
      url: "/",
    },
    {
      title: "Utils",
      url: "/utils",
    },
  ],
  extraBreadcrumbs: (routerParams: Readonly<Params<string>>) => {
    return [
      {
        title: "Channel",
        url: `/channels/${routerParams.name}`,
      },
    ];
  },
};

export default { loader, handle };

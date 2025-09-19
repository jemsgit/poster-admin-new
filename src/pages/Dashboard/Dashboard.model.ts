import { store } from "../../store/store";

import { botsApi } from "../../store/bots/bots";
import { channelsApi } from "../../store/channels/api";
import { grabbersApi } from "../../store/grabbers/api";
import { DashboardData } from "./types";
import { RouterLoader } from "../../routes/routes.types";

const loader = async (): Promise<RouterLoader<DashboardData>> => {
  const botsQuery = store.dispatch(botsApi.endpoints.bots.initiate());

  const channelsQuery = store.dispatch(
    channelsApi.endpoints.channels.initiate()
  );
  const grabbersQuery = store.dispatch(
    grabbersApi.endpoints.grabbers.initiate()
  );

  const data = Promise.all([botsQuery, channelsQuery, grabbersQuery]).then(
    (res) => {
      const bots = res[0].data;
      const channels = res[1].data;
      const grabbers = res[2].data;
      return {
        bots,
        channels,
        grabbers,
      };
    }
  );

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
      title: "Dashboard",
    },
  ],
};

export default {
  loader,
  handle,
};

import { createBrowserRouter } from "react-router-dom";
import Channels from "../pages/Channels/Channels";
import Error from "../components/Error/Error";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Layout from "../components/Layout/Layout";
import dashboardLoader from "../pages/Dashboard/Dashboard.model";
import channelLoader from "../pages/Channel/Channel.model";
import channelsLoader from "../pages/Channels/Channels.model";
import Channel from "../pages/Channel/Channel";
import ContentEditor from "../pages/ContentEditor/ContentEditor";
import contentEditLoader from "../pages/ContentEditor/ContentEditor.model";
import GrabberPage from "../pages/Grabber/Grabber";
import grabberLoader from "../pages/Grabber/Grabber.model";

const basename = import.meta.env.BASE_URL || "/";

const getRoutes = () => {
  return createBrowserRouter(
    [
      {
        path: "",
        errorElement: <Error />,
        children: [
          {
            path: "/login",
            Component: Login,
          },
          {
            path: "",
            element: <Layout />,
            children: [
              {
                path: "/channels", // Accessible at "/channels"
                children: [
                  {
                    index: true,
                    element: <Channels />,
                    loader: channelsLoader.loader,
                    handle: channelsLoader.handle,
                  },
                  {
                    path: ":name",
                    element: <Channel />,
                    loader: channelLoader.loader,
                    handle: channelLoader.handle,
                  },
                  {
                    path: "content-edit/:name/:type",
                    element: <ContentEditor />,
                    loader: contentEditLoader.loader,
                    handle: contentEditLoader.handle,
                  },
                ],
              },
              {
                path: "/bots", // Accessible at "/bots"
                children: [
                  {
                    index: true,
                    element: <Channels />,
                  },
                  {
                    path: ":name",
                    element: <Channel />,
                  },
                ],
              },
              {
                path: "/grabbers", // Accessible at "/channels"
                children: [
                  {
                    index: true,
                    element: <GrabberPage />,
                  },
                  {
                    path: ":channelId",
                    loader: grabberLoader.loader,
                    handle: grabberLoader.handle,
                    element: <GrabberPage />,
                  },
                ],
              },
              {
                path: "/", // Accessible at "/dashboard"
                element: <Dashboard />,
                loader: dashboardLoader.loader,
                handle: dashboardLoader.handle,
              },
              {
                path: "dashboard", // Accessible at "/dashboard"
                element: <Dashboard />,
                loader: dashboardLoader.loader,
                handle: dashboardLoader.handle,
              },
              {
                path: "*", // replace for 404
                element: <Dashboard />,
                loader: dashboardLoader.loader,
                handle: dashboardLoader.handle,
              },
            ],
          },
        ],
      },
    ],
    { basename }
  );
};

const router = getRoutes();

export default router;

import { createBrowserRouter } from "react-router-dom";
import Channels from "../pages/Channels/Channels";
import Error from "../components/Error/Error";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Layout from "../components/Layout/Layout";
import dashboardLoader from "../pages/Dashboard/Dashboard.model";
import channelLoader from "../pages/Channel/Channel.model";
import { Suspense } from "react";
import Channel from "../pages/Channel/Channel";
import ContentEditor from "../pages/ContentEditor/ContentEditor";

const getRoutes = () => {
  return createBrowserRouter([
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
                },
                {
                  path: ":name",
                  element: <Channel />,
                  loader: channelLoader.loader,
                },
                {
                  path: "content-edit/:name/:type",
                  element: <ContentEditor />,
                  loader: channelLoader.loader,
                },
              ],
            },
            {
              path: "bots", // Accessible at "/channels"
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
              path: "grabbers", // Accessible at "/channels"
              loader: dashboardLoader.loader,
              handle: dashboardLoader.handle,
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
          ],
        },
      ],
    },
  ]);
};

const router = getRoutes();

export default router;

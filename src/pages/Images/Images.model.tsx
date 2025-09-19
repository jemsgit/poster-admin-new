import { LoaderFunctionArgs } from "react-router-dom";
import { utilsApi } from "../../store/utils/api";
import { store } from "../../store/store";

const loader = () => {
  const imagesQuery = store
    .dispatch(utilsApi.endpoints.images.initiate())
    .then((res) => res.data);
  return {
    data: imagesQuery,
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
    {
      title: "Images",
      url: "/utils/images",
    },
  ],
};

export default { loader, handle };

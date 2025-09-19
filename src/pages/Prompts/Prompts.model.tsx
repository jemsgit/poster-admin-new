import { utilsApi } from "../../store/utils/api";
import { store } from "../../store/store";

const loader = () => {
  const promptsQuery = store
    .dispatch(utilsApi.endpoints.prompts.initiate())
    .then((res) => res.data);
  return {
    prompts: promptsQuery,
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
      title: "Prompts",
      url: `/urils/prompts`,
    },
  ],
};

export default { loader, handle };

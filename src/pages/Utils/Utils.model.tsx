const loader = () => {
  return {
    data: Promise.resolve({}),
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
};

export default { loader, handle };

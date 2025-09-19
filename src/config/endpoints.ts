const endpoints = {
  login: {
    post: "/api/login",
    refresh: "/api/login/refresh",
  },
  channels: {
    get: "/api/channels/info",
    getSingle: "/api/channels/info/:id",
    getContent: "/api/channels/content",
    saveContent: "/api/channels/content",
    update: "/api/channels/info/:id/update",
    copyContent: "/api/channels/copy-content/:id/:type",
  },
  bots: {
    get: "/api/bots",
    getSingle: "/api/bots/:id",
  },
  grabbers: {
    get: "/api/grabbers",
    getSingle: "/api/channels/grabber/:id",
    testGrabber: "/api/channels/test-grab/:id",
  },
  suggestions: {
    ask: "/api/suggestions/ask",
  },
  utils: {
    images: {
      getImage: "/api/utils/image",
      getImageAndInfo: "/api/utils/fetch-images",
      get: "/api/utils/images",
      upload: "/api/utils/images",
      delete: "/api/utils/images/:id",
    },
    prompts: {
      get: "/api/prompts",
      add: "/api/prompts",
      delete: "/api/prompts/:id",
    },
  },
};

export default endpoints;

const endpoints = {
  login: {
    post: "/api/login",
    refresh: "/api/login/refresh",
  },
  channels: {
    get: "/api/channels",
    getSingle: "/api/channels/:id",
    getContent: "/api/channels/content",
    saveContent: "/api/channels/content",
    update: "/api/channels/:id/update",
  },
  bots: {
    get: "/api/bots",
    getSingle: "/api/bots/:id",
  },
  grabbers: {
    get: "/api/grabbers",
    getSingle: "/api/grabbers/:id",
  },
};

export default endpoints;

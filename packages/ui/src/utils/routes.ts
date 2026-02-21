export const routes = {
  apiDocs: {
    location: "/api/docs",
  },
  networkPage: {
    path: "network",
    location: "/network",
  },
  filesPage: {
    path: "files",
    location: "/files",
  },
  replaysViewPage: {
    path: "replays",
    location: "/replays",
  },
  replaysCreatePage: {
    path: "replays/create",
    location: "/replays/create",
  },
  replaysEditPage: {
    path: "replays/edit/:id",
    location: (id: string) => `/replays/edit/${id}`,
  },
};

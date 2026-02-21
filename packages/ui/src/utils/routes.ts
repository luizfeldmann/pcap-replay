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
    searchParams: {
      file: "file",
    },
    location: (file?: string) => {
      const pathname = "/replays/create";
      if (!file) return pathname;
      return pathname + "?file=" + file;
    },
  },
  replaysEditPage: {
    path: "replays/edit/:id",
    location: (id: string) => `/replays/edit/${id}`,
  },
};

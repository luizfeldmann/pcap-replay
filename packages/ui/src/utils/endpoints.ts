export const endpoints = {
  getNetworkInterfaces: {
    path: "/api/network/interfaces",
    method: "GET",
  },
  getFiles: {
    path: (limit: string, cursor?: string) => {
      const params = new URLSearchParams({
        limit,
      });
      if (cursor && cursor.length) params.append("cursor", cursor);
      return `/api/files?${params.toString()}`;
    },
    method: "GET",
  },
  deleteFile: {
    path: (id: string) => `/api/files/${id}`,
    method: "DELETE",
  },
  renameFile: {
    path: (id: string) => `/api/files/${id}`,
    method: "PATCH",
  },
  downloadFile: {
    path: (id: string) => `/api/files/${id}`,
    method: "GET",
  },
  uploadFile: {
    path: "/api/files",
    method: "POST",
  },
};

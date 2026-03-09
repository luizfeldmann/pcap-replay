import type { JobCommand } from "shared";

export const endpoints = {
  /** NETWORK */
  getNetworkInterfaces: {
    path: "/api/network/interfaces",
    method: "GET",
  },
  /** FILES */
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
  getSingleFile: {
    path: (id: string) => `/api/files/${id}`,
    method: "GET",
  },
  downloadFile: {
    path: (id: string) => `/api/files/download/${id}`,
    method: "GET",
  },
  uploadFile: {
    path: "/api/files",
    method: "POST",
  },
  subscribeFilesEvents: {
    path: "/api/files/events",
  },
  /** REPLAY */
  getReplays: {
    path: (limit: string, cursor?: string) => {
      const params = new URLSearchParams({
        limit,
      });
      if (cursor && cursor.length) params.append("cursor", cursor);
      return `/api/jobs/replay?${params.toString()}`;
    },
    method: "GET",
  },
  getSingleReplay: {
    path: (id: string) => `/api/jobs/replay/${id}`,
    method: "GET",
  },
  postReplay: {
    path: "/api/jobs/replay",
    method: "POST",
  },
  patchReplay: {
    path: (id: string) => `/api/jobs/replay/${id}`,
    method: "PATCH",
  },
  deleteReplay: {
    path: (id: string) => `/api/jobs/replay/${id}`,
    method: "DELETE",
  },
  postReplayCommand: {
    path: (id: string, command: JobCommand) =>
      `/api/jobs/replay/${id}/${command}`,
    method: "POST",
  },
  subscribeReplaysEvents: {
    path: "/api/jobs/replay/events",
  },
  subscribeReplayLogs: {
    path: (id: string) => `/api/jobs/replay/${id}/logs`,
  },
};

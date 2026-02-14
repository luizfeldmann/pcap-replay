import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  FileListItemSchema,
  PaginatedFileListResponseSchema,
  type FileListItem,
  type FilePatch,
  type PaginatedFileListResponse,
} from "shared";
import endpoints from "../constants/endpoints.json";
import { itemPrepend, itemsFilter, itemsMap } from "./pagedDataTransform";

const QUERY_KEY = "files";

export const useFilesList = () =>
  useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: "50",
      });
      if (pageParam.length) params.append("cursor", pageParam);
      const resp = await fetch(`${endpoints.getFiles}?${params.toString()}`);
      const body = await resp.json();
      const page = PaginatedFileListResponseSchema.parse(body);
      return page;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const useFileUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Build a form with the file
      const formData = new FormData();
      formData.append("file", file);

      // Post the file
      const res = await fetch(endpoints.uploadFile, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      // Read the returned file
      const body = await res.json();
      return FileListItemSchema.parse(body);
    },
    onSuccess: (data) => {
      // Prepend the returned file data in the cache list
      queryClient.setQueryData<InfiniteData<PaginatedFileListResponse>>(
        [QUERY_KEY],
        (oldData) => itemPrepend(oldData, "items", data),
      );
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; name: string }) => {
      const resp = await fetch(`${endpoints.deleteFile}/${variables.id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error(resp.statusText);
    },
    onSuccess: (_data, variables) => {
      // Remove the file from the query cache
      queryClient.setQueryData<InfiniteData<PaginatedFileListResponse>>(
        [QUERY_KEY],
        (oldData) =>
          itemsFilter<PaginatedFileListResponse, FileListItem>(
            oldData,
            "items",
            // Filter (keep) all files whose IDs are NOT the deleted file
            (item) => item.id !== variables.id,
          ),
      );
    },
  });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; patch: FilePatch }) => {
      const resp = await fetch(`${endpoints.renameFile}/${variables.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables.patch),
      });
      if (!resp.ok) throw new Error(resp.statusText);

      // Return the new file state from the response
      const body = await resp.json();
      return FileListItemSchema.parse(body);
    },
    onSuccess: (data) =>
      // Rename the file in the query cache
      queryClient.setQueryData<InfiniteData<PaginatedFileListResponse>>(
        [QUERY_KEY],
        (oldData) =>
          itemsMap<PaginatedFileListResponse, FileListItem>(
            oldData,
            "items",
            // The renamed file maps to the new data
            // the other files map to themselves
            (item) => (item.id === data.id ? data : item),
          ),
      ),
  });
};

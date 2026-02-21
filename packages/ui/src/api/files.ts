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
import { endpoints } from "../utils/endpoints";
import { itemPrepend, itemsFilter, itemsMap } from "./pagedDataTransform";

const QUERY_KEY = "files";

export const useFilesList = () =>
  useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ pageParam }) => {
      const resp = await fetch(endpoints.getFiles.path("50", pageParam));
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
      const res = await fetch(endpoints.uploadFile.path, {
        method: endpoints.uploadFile.method,
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
      const resp = await fetch(endpoints.deleteFile.path(variables.id), {
        method: endpoints.deleteFile.method,
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
      const resp = await fetch(endpoints.renameFile.path(variables.id), {
        method: endpoints.renameFile.method,
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

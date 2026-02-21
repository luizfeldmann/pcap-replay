import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import type { FileListItem, PaginatedFileListResponse } from "shared";
import { QUERY_KEY_FILES } from "./useFilesList";
import { itemsFilter } from "../pagedDataTransform";

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
        [QUERY_KEY_FILES],
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

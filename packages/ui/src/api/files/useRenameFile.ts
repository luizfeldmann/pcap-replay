import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import {
  FileListItemSchema,
  type FileListItem,
  type FilePatch,
  type PaginatedFileListResponse,
} from "shared";
import { QUERY_KEY_FILES } from "./useFilesList";
import { itemsMap } from "../pagedDataTransform";

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
        [QUERY_KEY_FILES],
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

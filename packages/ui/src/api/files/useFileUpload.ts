import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import { FileListItemSchema, type PaginatedFileListResponse } from "shared";
import { QUERY_KEY_FILES } from "./useFilesList";
import { itemPrepend } from "../pagedDataTransform";

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
        [QUERY_KEY_FILES],
        (oldData) => itemPrepend(oldData, "items", data),
      );
    },
  });
};

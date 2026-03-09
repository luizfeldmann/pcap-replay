import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import { FileListItemSchema, type FilePatch } from "shared";
import { onFilePatch } from "./useFileNormalization";

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
      onFilePatch(queryClient, { topic: "file", operation: "patch", data }),
  });
};

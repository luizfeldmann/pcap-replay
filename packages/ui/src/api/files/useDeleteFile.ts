import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import { onFileDeleted } from "./useFileNormalization";

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; name: string }) => {
      const resp = await fetch(endpoints.deleteFile.path(variables.id), {
        method: endpoints.deleteFile.method,
      });
      if (!resp.ok) throw new Error(resp.statusText);
    },
    onSuccess: (_data, variables) =>
      onFileDeleted(queryClient, {
        topic: "file",
        operation: "delete",
        data: { id: variables.id },
      }),
  });
};

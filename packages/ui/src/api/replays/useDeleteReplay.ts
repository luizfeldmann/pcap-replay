import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import { onReplayDeleted } from "./useReplayNormalization";

export const useDeleteReplay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; name: string }) => {
      const resp = await fetch(endpoints.deleteReplay.path(variables.id), {
        method: endpoints.deleteReplay.method,
      });
      if (!resp.ok) throw new Error(resp.statusText);
    },
    onSuccess: (_data, variables) =>
      onReplayDeleted(queryClient, {
        topic: "replay",
        operation: "delete",
        data: { id: variables.id },
      }),
  });
};

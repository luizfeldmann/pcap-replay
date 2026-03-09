import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReplayListItemSchema, type ReplayPost } from "shared";
import { endpoints } from "../../utils/endpoints";
import { onReplayCreated } from "./useReplayNormalization";

export const usePostReplay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replay: ReplayPost) => {
      // Post the definition of the new job
      const res = await fetch(endpoints.postReplay.path, {
        method: endpoints.postReplay.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(replay),
      });

      // Get the full object back, with an ID
      if (!res.ok) throw new Error(res.statusText);
      const resBody = await res.json();
      return ReplayListItemSchema.parse(resBody);
    },
    onSuccess: (data) =>
      onReplayCreated(queryClient, {
        topic: "replay",
        operation: "create",
        data,
      }),
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReplayListItemSchema, type ReplayPatch } from "shared";
import { endpoints } from "../../utils/endpoints";
import { onReplayPatch } from "./useReplayNormalization";

export const usePatchReplay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; patch: ReplayPatch }) => {
      const resp = await fetch(endpoints.patchReplay.path(variables.id), {
        method: endpoints.patchReplay.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables.patch),
      });
      if (!resp.ok) throw new Error(resp.statusText);

      const body = await resp.json();
      return ReplayListItemSchema.parse(body);
    },
    onSuccess: (data) =>
      onReplayPatch(queryClient, { topic: "replay", operation: "patch", data }),
  });
};

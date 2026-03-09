import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReplayCommandResponseSchema, type JobCommand } from "shared";
import { endpoints } from "../../utils/endpoints";
import { onReplayStatus } from "./useReplayNormalization";

export const REPLAYS_COMMAND_MUTATION_KEY = "replay-command";

export const useReplayCommand = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [REPLAYS_COMMAND_MUTATION_KEY, id],
    mutationFn: async (variables: { name: string; command: JobCommand }) => {
      const resp = await fetch(
        endpoints.postReplayCommand.path(id, variables.command),
        {
          method: endpoints.postReplayCommand.method,
        },
      );
      if (!resp.ok) throw new Error(resp.statusText);
      const resBody = await resp.json();
      return ReplayCommandResponseSchema.parse(resBody);
    },
    onSuccess: (data) =>
      onReplayStatus(queryClient, {
        topic: "replay",
        operation: "status",
        data,
      }),
  });

  const isMutating = useIsMutating({
    mutationKey: [REPLAYS_COMMAND_MUTATION_KEY, id],
  });

  return { ...mutation, isMutating };
};

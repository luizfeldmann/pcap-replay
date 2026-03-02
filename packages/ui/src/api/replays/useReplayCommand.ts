import {
  useIsMutating,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type {
  JobCommand,
  PaginatedReplayListResponse,
  ReplayListItem,
} from "shared";
import { endpoints } from "../../utils/endpoints";
import { REPLAYS_QUERY_KEY } from "./useReplaysList";
import { itemsMap } from "../pagedDataTransform";

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
    },
    onSuccess: (_, variables) =>
      // Change the status of the job according to the succeeded command
      queryClient.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
        [REPLAYS_QUERY_KEY],
        (oldData) =>
          itemsMap<PaginatedReplayListResponse, ReplayListItem>(
            oldData,
            "items",
            (item) => {
              if (item.id !== id) return item;
              const status =
                variables.command === "start" ? "RUNNING" : "STOPPED";
              return { ...item, status };
            },
          ),
      ),
  });

  const isMutating = useIsMutating({
    mutationKey: [REPLAYS_COMMAND_MUTATION_KEY, id],
  });

  return { ...mutation, isMutating };
};

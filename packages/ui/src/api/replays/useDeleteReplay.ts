import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { endpoints } from "../../utils/endpoints";
import type { PaginatedReplayListResponse, ReplayListItem } from "shared";
import { REPLAYS_QUERY_KEY } from "./useReplaysList";
import { itemsFilter } from "../pagedDataTransform";

export const useDeleteReplay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { id: string; name: string }) => {
      const resp = await fetch(endpoints.deleteReplay.path(variables.id), {
        method: endpoints.deleteReplay.method,
      });
      if (!resp.ok) throw new Error(resp.statusText);
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
        [REPLAYS_QUERY_KEY],
        (oldData) =>
          itemsFilter<PaginatedReplayListResponse, ReplayListItem>(
            oldData,
            "items",
            (item) => item.id !== variables.id,
          ),
      );
    },
  });
};

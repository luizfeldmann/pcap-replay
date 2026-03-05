import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  ReplayListItemSchema,
  type PaginatedReplayListResponse,
  type ReplayListItem,
  type ReplayPatch,
} from "shared";
import { endpoints } from "../../utils/endpoints";
import { REPLAYS_QUERY_KEY } from "./useReplaysList";
import { itemsMap } from "../pagedDataTransform";

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
      // Rename the file in the query cache
      queryClient.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
        [REPLAYS_QUERY_KEY],
        (oldData) =>
          itemsMap<PaginatedReplayListResponse, ReplayListItem>(
            oldData,
            "items",
            (item) => (item.id === data.id ? data : item),
          ),
      ),
  });
};

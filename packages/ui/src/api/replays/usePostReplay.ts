import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  ReplayListItemSchema,
  type PaginatedReplayListResponse,
  type ReplayPost,
} from "shared";
import { endpoints } from "../../utils/endpoints";
import { REPLAYS_QUERY_KEY } from "./useReplaysList";
import { itemPrepend } from "../pagedDataTransform";

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
    onSuccess: (data) => {
      // Prepend the returned file data in the cache list
      queryClient.setQueryData<InfiniteData<PaginatedReplayListResponse>>(
        [REPLAYS_QUERY_KEY],
        (oldData) => itemPrepend(oldData, "items", data),
      );
    },
  });
};

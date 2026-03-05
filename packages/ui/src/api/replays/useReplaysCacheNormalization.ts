import { useQueryClient } from "@tanstack/react-query";
import { REPLAYS_QUERY_KEY, useReplaysList } from "./useReplaysList";
import { useEffect } from "react";

export const useReplaysCacheNormalization = () => {
  const queryClient = useQueryClient();
  const listQuery = useReplaysList({ enabled: false });

  // Instantly resolve the single-replay queries
  useEffect(
    () =>
      listQuery.data?.pages.forEach((page) =>
        page.items.forEach((item) =>
          queryClient.setQueryData([REPLAYS_QUERY_KEY, item.id], item),
        ),
      ),
    [queryClient, listQuery.data],
  );
};

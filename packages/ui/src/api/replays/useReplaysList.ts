import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginatedReplayListResponseSchema } from "shared";
import { endpoints } from "../../utils/endpoints";

export const REPLAYS_QUERY_KEY = "replays";

export const useReplaysList = () =>
  useInfiniteQuery({
    queryKey: [REPLAYS_QUERY_KEY],
    queryFn: async ({ pageParam }) => {
      const resp = await fetch(endpoints.getReplays.path("50", pageParam));
      const body = await resp.json();
      const page = PaginatedReplayListResponseSchema.parse(body);
      return page;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

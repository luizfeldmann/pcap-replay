import { useQuery, useQueryClient } from "@tanstack/react-query";
import { REPLAYS_QUERY_KEY, getReplayFromListCache } from "./useReplaysList";
import { endpoints } from "../../utils/endpoints";
import { ReplayListItemSchema } from "shared";

export const useSingleReplay = (options: {
  id: string;
  refetchOnMount?: boolean;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [REPLAYS_QUERY_KEY, options.id],
    queryFn: async () => {
      const resp = await fetch(endpoints.getSingleReplay.path(options.id));
      if (!resp.ok) throw new Error(resp.statusText);
      const body = await resp.json();
      const replay = ReplayListItemSchema.parse(body);
      return replay;
    },
    placeholderData: () => getReplayFromListCache(queryClient, options.id),
    refetchOnMount: options.refetchOnMount,
    enabled: options.id.length !== 0 && options.enabled !== false,
  });
};

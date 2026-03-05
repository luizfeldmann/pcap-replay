import { useQuery } from "@tanstack/react-query";
import { REPLAYS_QUERY_KEY } from "./useReplaysList";
import { endpoints } from "../../utils/endpoints";
import { ReplayListItemSchema } from "shared";

export const useSingleReplay = (options: {
  id: string;
  refetchOnMount?: boolean;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: [REPLAYS_QUERY_KEY, options.id],
    queryFn: async () => {
      const resp = await fetch(endpoints.getSingleReplay.path(options.id));
      if (!resp.ok) throw new Error(resp.statusText);
      const body = await resp.json();
      const file = ReplayListItemSchema.parse(body);
      return file;
    },
    refetchOnMount: options.refetchOnMount,
    enabled: options.id.length !== 0 && options.enabled !== false,
  });

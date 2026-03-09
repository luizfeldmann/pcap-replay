import { useQueryClient } from "@tanstack/react-query";
import { useSSE } from "../useSSE";
import { onReplayEvent } from "./useReplayNormalization";
import { useCallback } from "react";
import { ReplayEventSchema } from "shared";
import { endpoints } from "../../utils/endpoints";

const SSE_KEY_REPLAYS_EVENTS = "sse-replays-events";

export const useReplayEvents = () => {
  const queryClient = useQueryClient();

  // Dispatch replay events to cache normalizer
  const handler = useCallback(
    (e: MessageEvent) => {
      // Parse the event message
      const { data, success } = ReplayEventSchema.safeParse(JSON.parse(e.data));
      if (!success) return;

      // Dispatch to cache
      onReplayEvent(queryClient, data);
    },
    [queryClient],
  );

  // Subscribe to file events source
  useSSE({
    key: SSE_KEY_REPLAYS_EVENTS,
    url: endpoints.subscribeReplaysEvents.path,
    handler,
  });
};

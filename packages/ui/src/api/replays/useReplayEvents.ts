import { useSSE } from "../useSSE";
import { endpoints } from "../../utils/endpoints";
import { useReplayEventHandler } from "./useReplayEventHandler";

const SSE_KEY_REPLAYS_EVENTS = "sse-replays-events";

export const useReplayEvents = () => {
  // Dispatch replay events to cache normalizer
  const handler = useReplayEventHandler();

  // Subscribe to replay events source
  useSSE({
    key: SSE_KEY_REPLAYS_EVENTS,
    url: endpoints.subscribeReplaysEvents.path,
    handler,
  });
};

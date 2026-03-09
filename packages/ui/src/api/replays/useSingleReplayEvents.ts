import { useReplayEventHandler } from "./useReplayEventHandler";
import { useSSE } from "../useSSE";
import { endpoints } from "../../utils/endpoints";

const getSubscriptionKey = (id: string) => "sse-replay-events-" + id;

export const useSingleReplayEvents = (id: string) => {
  // Dispatch replay events to cache normalizer
  const handler = useReplayEventHandler();

  // Subscribe to replay events source for the given replay ID only
  useSSE({
    key: getSubscriptionKey(id),
    url: endpoints.subscribeSingleReplayItemEvents.path(id),
    handler,
    disabled: id.length === 0,
  });
};

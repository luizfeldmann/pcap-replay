import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { ReplayEventSchema } from "shared";
import { onReplayEvent } from "./useReplayNormalization";
import { useCallback } from "react";

// Given a raw message event, parses as a replay event and dispatches
const onReplayEventRaw = (qc: QueryClient, event: MessageEvent) => {
  // Parse the event message
  const { data, success } = ReplayEventSchema.safeParse(JSON.parse(event.data));
  if (!success) return;

  // Dispatch to cache
  onReplayEvent(qc, data);
};

//! Creates a callback to handler raw replay events
export const useReplayEventHandler = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (e: MessageEvent) => onReplayEventRaw(queryClient, e),
    [queryClient],
  );
};

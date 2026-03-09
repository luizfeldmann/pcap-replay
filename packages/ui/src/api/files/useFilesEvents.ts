import { FileEventSchema } from "shared";
import { endpoints } from "../../utils/endpoints";
import { useSSE } from "../useSSE";
import { onFileEvent } from "./useFileNormalization";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const SSE_KEY_FILES_EVENTS = "sse-files-events";

export const useFilesEvents = () => {
  const queryClient = useQueryClient();

  // Dispatch files events to cache normalizer
  const handler = useCallback(
    (e: MessageEvent) => {
      // Parse the event message
      const { data, success } = FileEventSchema.safeParse(JSON.parse(e.data));
      if (!success) return;

      // Dispatch to cache
      onFileEvent(queryClient, data);
    },
    [queryClient],
  );

  // Subscribe to file events source
  useSSE({
    key: SSE_KEY_FILES_EVENTS,
    url: endpoints.subscribeFilesEvents.path,
    handler,
  });
};

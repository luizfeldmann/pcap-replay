import { useCallback, useState } from "react";
import { useSSE } from "../useSSE";
import { endpoints } from "../../utils/endpoints";
import { ReplayLogEventSchema } from "shared";

const SSE_KEY_REPLAY_LOGS = "sse-replay-logs";

export const useReplayLogs = (id: string) => {
  // Stores accumulated logs
  const [logs, setLogs] = useState<string[]>([]);

  // Parses the event message and extracts the log
  const handler = useCallback(
    (e: MessageEvent) => {
      // Parse the event message
      const { data, success } = ReplayLogEventSchema.safeParse(
        JSON.parse(e.data),
      );
      if (!success) return;

      // Append the logs
      setLogs((prev) => [...prev, ...data.data.logs]);
    },
    [setLogs],
  );

  // Subscribe to the enpoint
  useSSE({
    key: SSE_KEY_REPLAY_LOGS,
    url: endpoints.subscribeReplayLogs.path(id),
    handler,
  });

  return { logs };
};

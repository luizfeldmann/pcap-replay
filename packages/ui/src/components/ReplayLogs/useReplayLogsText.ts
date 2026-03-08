import { useEffect, useState } from "react";

export const useReplayLogsText = (id: string) => {
  // Joined log text
  const [logLines, setLogLines] = useState<string[]>([]);

  // Simulate log for now...
  useEffect(() => {
    const timer = setInterval(
      () =>
        setLogLines((prev) => [
          ...prev,
          new Date().getMilliseconds().toString(),
        ]),
      200,
    );
    return () => clearInterval(timer);
  }, [setLogLines]);

  return { logLines };
};

import { Virtuoso } from "react-virtuoso";
import { Alert, LinearProgress } from "@mui/material";
import { useReplaysList } from "../../api/replays/useReplaysList";
import { ReplayJobsCard } from "./ReplayJobsCard";
import { ReplayContextMenu } from "../ReplayContextMenu/ReplayContextMenu";
import { useMemo } from "react";
import { useReplayContextMenu } from "../ReplayContextMenu/useReplayContextMenu";
import { useReplayEvents } from "../../api/replays/useReplayEvents";

export const ReplayJobsList = () => {
  // Query items from REST API
  const queryReplay = useReplaysList();

  // Get reactive updates
  useReplayEvents();

  // Single context menu for any of the items
  const contextMenu = useReplayContextMenu();

  // Flatten the pages into a single list
  const data = useMemo(
    () => queryReplay.data?.pages.flatMap((p) => p.items) ?? [],
    [queryReplay.data],
  );

  // Replace list with error if failed to fetch
  if (queryReplay.isError)
    return <Alert severity="error">{queryReplay.error.message}</Alert>;

  return (
    <>
      {queryReplay.isLoading && <LinearProgress />}
      <ReplayContextMenu
        state={contextMenu.state}
        actions={contextMenu.actions}
      />
      <Virtuoso
        data={data}
        endReached={() =>
          queryReplay.hasNextPage && void queryReplay.fetchNextPage()
        }
        itemContent={(_, item) => (
          <ReplayJobsCard
            data={item}
            onMore={(anchor) =>
              contextMenu.open(item.id, item.name, item.status, anchor)
            }
          />
        )}
        style={{ height: "100%" }}
      />
    </>
  );
};

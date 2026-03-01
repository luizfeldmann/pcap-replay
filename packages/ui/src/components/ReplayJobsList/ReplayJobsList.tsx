import { Virtuoso } from "react-virtuoso";
import { Alert, LinearProgress } from "@mui/material";
import { useReplaysList } from "../../api/replays/useReplaysList";
import { ReplayJobsCard } from "./ReplayJobsCard";

export const ReplayJobsList = () => {
  const queryReplay = useReplaysList();

  // Flatten the pages into a single list
  const data = queryReplay.data?.pages.flatMap((p) => p.items) ?? [];

  // Replace list with error if failed to fetch
  if (queryReplay.isError)
    return <Alert severity="error">{queryReplay.error.message}</Alert>;

  return (
    <Virtuoso
      data={data}
      endReached={() =>
        queryReplay.hasNextPage && void queryReplay.fetchNextPage()
      }
      itemContent={(_, item) => (
        <ReplayJobsCard data={item} onMore={(anchor) => {}} />
      )}
      style={{ height: "100%" }}
      components={{
        Header: () => <>{queryReplay.isLoading && <LinearProgress />}</>,
      }}
    />
  );
};

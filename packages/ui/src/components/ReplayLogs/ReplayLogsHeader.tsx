import type { ReplayListItem } from "shared";
import { ReplayJobsCard } from "../ReplayJobsList/ReplayJobsCard";
import { Box } from "@mui/material";
import { ReplayContextMenu } from "../ReplayContextMenu/ReplayContextMenu";
import { useReplayContextMenu } from "../ReplayContextMenu/useReplayContextMenu";

export const ReplayLogsHeader = (props: { data: ReplayListItem }) => {
  const contextMenu = useReplayContextMenu();

  return (
    <Box>
      <ReplayContextMenu
        actions={contextMenu.actions}
        state={contextMenu.state}
        disableItems={["logs", "delete"]}
      />
      <ReplayJobsCard
        data={props.data}
        onMore={(anchor) =>
          contextMenu.open(
            props.data.id,
            props.data.name,
            props.data.status,
            anchor,
          )
        }
      />
    </Box>
  );
};

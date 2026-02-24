import type { FunctionComponent } from "react";
import type { ReplayStatus } from "shared";
import { Icons } from "../../utils/Icons";
import type { SvgIconProps } from "@mui/material";

export type ReplayStatusStyle = {
  label: string;
  color: string;
  icon: FunctionComponent<SvgIconProps>;
};

//! Dictionary mapping the status to the styles
export const StatusStyles: Record<ReplayStatus, ReplayStatusStyle> = {
  ERROR: {
    label: "replays.status.error",
    color: "#f44336",
    icon: Icons.StatusError,
  },
  STOPPED: {
    label: "replays.status.stopped",
    color: "#ff9800",
    icon: Icons.StatusStopped,
  },
  FINISHED: {
    label: "replays.status.finished",
    color: "#2196f3",
    icon: Icons.StatusFinished,
  },
  RUNNING: {
    label: "replays.status.running",
    color: "#4caf50",
    icon: Icons.StatusRunning,
  },
};

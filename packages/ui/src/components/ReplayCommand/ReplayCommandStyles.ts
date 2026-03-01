import type { SvgIconProps } from "@mui/material";
import type { FunctionComponent } from "react";
import type { JobCommand } from "shared";
import { Icons } from "../../utils/Icons";

export type ReplayCommandStyle = {
  icon: FunctionComponent<SvgIconProps>;
  label: string;
  color: string;
};

export const ReplayCommandStyles: Record<JobCommand, ReplayCommandStyle> = {
  start: {
    icon: Icons.StatusRunning,
    label: "replays.context.startplay",
    color: "#4caf50",
  },
  stop: {
    icon: Icons.StatusStopped,
    label: "replays.context.stop",
    color: "#f44336",
  },
};

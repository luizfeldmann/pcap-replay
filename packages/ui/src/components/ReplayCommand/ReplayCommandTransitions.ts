import type { JobCommand, ReplayStatus } from "shared";

export const ReplayCommandTransitions: Record<ReplayStatus, JobCommand> = {
  STOPPED: "start",
  ERROR: "start",
  FINISHED: "start",
  RUNNING: "stop",
};

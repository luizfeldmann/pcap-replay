import { ReplayRow, ReplayRowStatus } from "../models/replay";

export type ReplayJobExitCb = (
  id: string,
  result: ReplayRowStatus,
) => Promise<void>;

//! Base for all provider implementations
export interface IReplayProvider {
  //! Starts the given job
  start(job: ReplayRow, onExit: ReplayJobExitCb): Promise<void>;

  //! Stops the job
  stop(job: ReplayRow): Promise<void>;
}

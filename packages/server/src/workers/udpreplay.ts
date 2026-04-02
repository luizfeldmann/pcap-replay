import { ReplayRow } from "../models/replay";
import { IReplayProvider, ReplayJobExitCb } from "./replayProvider";

export class UdpReplayProvider implements IReplayProvider {
  start(job: ReplayRow, onExit: ReplayJobExitCb): Promise<void> {
    throw new Error("Method not implemented.");
  }
  stop(job: ReplayRow): void {
    throw new Error("Method not implemented.");
  }
}

import { ReplayRow } from "../models/replay";
import { ReplayJobExitCb, IReplayProvider } from "./replayProvider";

//! Uses a datagram socket
export class DgramReplayProvider implements IReplayProvider {
  async start(job: ReplayRow, onExit: ReplayJobExitCb) {
    throw new Error("Method not implemented.");
  }
  stop(job: ReplayRow): void {
    throw new Error("Method not implemented.");
  }
}

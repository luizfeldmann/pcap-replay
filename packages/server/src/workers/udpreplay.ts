import { ReplayRow } from "../models/replay";
import { IReplayProvider, ReplayJobExitCb } from "./replayProvider";

export class UdpReplayProvider implements IReplayProvider {
  start(_job: ReplayRow, _onExit: ReplayJobExitCb): Promise<void> {
    throw new Error("Method not implemented.");
  }
  stop(_job: ReplayRow): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

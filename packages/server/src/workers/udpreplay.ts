import { getUdpReplayArgs, ReplaySettingsUdpReplay } from "shared";
import { ReplayRow } from "../models/replay.js";
import { ReplayService } from "../services/replay.js";
import { SpawnProvider } from "./spawnprovider.js";

//! Uses the udp-replay application as backend
export class UdpReplayProvider extends SpawnProvider {
  //! Constructor
  constructor() {
    super();
  }

  //! Gets the arguments to call tcpreplay-edit
  async getOptions(jobRow: ReplayRow) {
    // Collect all the other tables related to the job
    const job = await ReplayService.getJobDetails(jobRow);
    const settings = job.settings as ReplaySettingsUdpReplay;

    // Compile the arguments
    return {
      executableName: "udp-replay",
      arguments: getUdpReplayArgs(settings),
    };
  }
}

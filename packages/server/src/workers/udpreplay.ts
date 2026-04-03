import { getUdpReplayArgs, ReplaySettingsUdpReplay } from "shared";
import { ReplayRow } from "../models/replay.js";
import { ReplayService } from "../services/replay.js";
import { SpawnProvider } from "./spawnprovider.js";
import { FilesService } from "../services/files.js";

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
    const filepath = FilesService.getFilePathOnDisk(job.fileId);

    // Compile the arguments
    return ["udp-replay", ...getUdpReplayArgs(settings), filepath];
  }
}

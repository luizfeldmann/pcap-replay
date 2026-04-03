import { ReplayRow } from "../models/replay.js";
import { FilesService } from "../services/files.js";
import { ReplayService } from "../services/replay.js";
import { SpawnProvider } from "./spawnprovider.js";
import { getTcpReplayArgs, ReplaySettingsTcpReplay } from "shared";

//! Uses the TCP-REPLAY app
export class TcpReplayProvider extends SpawnProvider {
  //! Constructor
  constructor() {
    super();
  }

  //! Gets the arguments to call tcpreplay-edit
  async getOptions(jobRow: ReplayRow) {
    // Collect all the other tables related to the job
    const job = await ReplayService.getJobDetails(jobRow);
    const settings = job.settings as ReplaySettingsTcpReplay;
    const filepath = FilesService.getFilePathOnDisk(job.fileId);

    // Compile the arguments
    return ["tcpreplay-edit", ...getTcpReplayArgs(settings), filepath];
  }
}

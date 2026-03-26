import pty from "node-pty";
import { configData } from "../utils/config";
import { ReplayRow } from "../models/replay";
import { ReplayEvents } from "../events/replays";
import { ReplayService } from "../services/replay";
import { FilesService } from "../services/files";
import { getReplayArgs, ReplaySettingsTcpReplay } from "shared";
import { ReplayJobExitCb, IReplayProvider } from "./replayProvider";

//! Store the information of the spawned processes
type ProcessInfo = {
  pty: pty.IPty;
  isStop?: boolean;
};

//! Uses the TCP-REPLAY app
export class TcpReplayProvider implements IReplayProvider {
  //! Collection of all running processes
  processes: Map<string, ProcessInfo>;

  // Constructor
  constructor() {
    this.processes = new Map<string, ProcessInfo>();
  }

  //! Called when the job returns
  async onJobExit(id: string, exitCode: number, cb: ReplayJobExitCb) {
    // Unregister the process from the working map
    const process = this.processes.get(id);
    if (!process) return;
    this.processes.delete(id);

    if (process.isStop) {
      // Process was stopped by a command
      console.log(`stopped by command: '${id}'`);
      await cb(id, "STOPPED");
    } else if (exitCode === 0) {
      // Exit with success code
      console.log(`completed successfully: '${id}'`);
      await cb(id, "FINISHED");
    } else {
      // Exit with error code
      console.error(`exited with error: code ${exitCode} for '${id}'`);
      await cb(id, "ERROR");
    }
  }

  async start(jobRow: ReplayRow, onExit: ReplayJobExitCb) {
    // Collect all the other tables related to the job
    const job = await ReplayService.getJobDetails(jobRow);
    const settings = job.settings as ReplaySettingsTcpReplay;

    // Compile the arguments
    const filepath = FilesService.getFilePathOnDisk(job.fileId);
    const args = [...getReplayArgs(settings), filepath];

    // Spawn the process
    const executableName = "tcpreplay-edit";
    const proc = {
      pty: pty.spawn(executableName, args, {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.cwd(),
        env: process.env,
      }),
    };
    this.processes.set(job.id, proc);

    // Log the command line which launched the process
    ReplayEvents.emitLogEventData({
      id: job.id,
      logs: [[executableName, ...args].join(" ")],
    });

    // Collect console prints
    proc.pty.onData((text) =>
      ReplayEvents.emitLogEventData({
        id: job.id,
        logs: text.split("\n"),
      }),
    );

    // Handle exist code
    proc.pty.onExit(
      ({ exitCode }) => void this.onJobExit(job.id, exitCode, onExit),
    );
  }

  stop(job: ReplayRow) {
    new Promise<void>((resolve, reject) => {
      // Get the process from the ID
      const proc = this.processes.get(job.id);
      if (!proc) return reject(new Error(`job is not running: ${job.id}`));

      // Timeout to kill the process
      const timeout = setTimeout(() => {
        reject(`timeout stopping job: ${job.id}`);
      }, configData.WORKER_PERIOD_REPLAY_START_STOP);

      // Resolve the promise when the job exits
      proc.pty.onExit(() => {
        clearTimeout(timeout);
        resolve();
      });

      // Request to kill the process and flag it as purposefully stopped
      proc.isStop = true;
      proc.pty.kill();
    });
  }
}

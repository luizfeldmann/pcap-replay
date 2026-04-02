import pty from "node-pty";
import { configData } from "../utils/config.js";
import { ReplayRow } from "../models/replay.js";
import { ReplayEvents } from "../events/replays.js";
import { ReplayJobExitCb, IReplayProvider } from "./replayProvider.js";

//! Store the information of the spawned processes
type ProcessInfo = {
  pty: pty.IPty;
  isStop?: boolean;
};

//! Arguments returned by the concrete provider
export type SpawnProviderOptions = {
  executableName: string;
  arguments: string[];
};

//! Uses the a subprocess as backend
export abstract class SpawnProvider implements IReplayProvider {
  //! Collection of all running processes
  processes: Map<string, ProcessInfo>;

  //! Constructor
  constructor() {
    this.processes = new Map<string, ProcessInfo>();
  }

  //! Gets the arguments to spawn the process
  abstract getOptions(jobRow: ReplayRow): Promise<SpawnProviderOptions>;

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
    // Get the arguments
    const options = await this.getOptions(jobRow);

    // Spawn the process
    const executableName = "tcpreplay-edit";
    const proc = {
      pty: pty.spawn(options.executableName, options.arguments, {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.cwd(),
        env: process.env,
      }),
    };
    this.processes.set(jobRow.id, proc);

    // Log the command line which launched the process
    ReplayEvents.emitLogEventData({
      id: jobRow.id,
      logs: [[executableName, ...options.arguments].join(" ")],
    });

    // Collect console prints
    proc.pty.onData((text) =>
      ReplayEvents.emitLogEventData({
        id: jobRow.id,
        logs: text.split("\n"),
      }),
    );

    // Handle exist code
    proc.pty.onExit(
      ({ exitCode }) => void this.onJobExit(jobRow.id, exitCode, onExit),
    );
  }

  async stop(job: ReplayRow) {
    return new Promise<void>((resolve, reject) => {
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

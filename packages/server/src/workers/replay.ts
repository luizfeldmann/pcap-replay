import { configData } from "../utils/config.js";
import EventEmitter from "events";
import { TimeoutError } from "../utils/error.js";
import { ReplayService } from "../services/replay.js";
import { ReplayRow, ReplayRowStatus } from "../models/replay.js";
import { GetReplayArgs, ReplayCommandResponse } from "shared";
import { FilesService } from "../services/files.js";
import pty from "node-pty";
import { ReplayEvents } from "../events/replays.js";

//! Notifies when the status of a job has changed
const statusChange = new EventEmitter();

//! Store the information of the spawned processes
type ProcessInfo = {
  pty: pty.IPty;
  isStop?: boolean;
};

const processes = new Map<string, ProcessInfo>();

//! Sets the new state of a job in DB and notifies observers
async function setStateAndNotify(id: string, state: ReplayRowStatus) {
  const snapshot = await ReplayService.setJobState(id, state);
  statusChange.emit(id, snapshot);
}

//! Called when the job returns
async function onJobExit(id: string, exitCode: number) {
  // Unregister the process from the working map
  const process = processes.get(id);
  if (!process) return;
  processes.delete(id);

  if (process.isStop) {
    // Process was stopped by a command
    console.log(`stopped by command: '${id}'`);
    await setStateAndNotify(id, "STOPPED");
  } else if (exitCode === 0) {
    // Exit with success code
    console.log(`completed successfully: '${id}'`);
    await setStateAndNotify(id, "FINISHED");
  } else {
    // Exit with error code
    console.error(`exited with error: code ${exitCode} for '${id}'`);
    await setStateAndNotify(id, "ERROR");
  }
}

async function runJobUnsafe(jobRow: ReplayRow) {
  // Collect all the other tables related to the job
  const job = await ReplayService.getJobDetails(jobRow);

  // Compile the arguments
  const filepath = FilesService.getFilePathOnDisk(job.fileId);
  const args = [...GetReplayArgs(job), filepath];

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
  processes.set(job.id, proc);

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
  proc.pty.onExit(({ exitCode }) => void onJobExit(job.id, exitCode));
}

async function runJob(job: ReplayRow) {
  try {
    // Try to run the job
    await runJobUnsafe(job);

    // Update state if succesful
    await setStateAndNotify(job.id, "RUNNING");
  } catch (err) {
    console.error(`failed to start job '${job.id}' - '${job.name}': ${err}`);

    // Change job to error state if unable to start
    await setStateAndNotify(job.id, "ERROR");
  }
}

const stopJob = (job: ReplayRow) =>
  new Promise<void>((resolve, reject) => {
    // Get the process from the ID
    const proc = processes.get(job.id);
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

//! Periodically check status of jobs and performs the start/stop
async function checkStartStopJobs() {
  // Get all jobs in the REQUEST_* state
  const jobs = await ReplayService.getScheduledJobs();

  // Execute the actual run/stop for each one
  await Promise.all(
    jobs.map((job) => {
      if (job.status === "REQUEST_RUN") return runJob(job);
      else if (job.status === "REQUEST_STOP") return stopJob(job);
      else return Promise.resolve();
    }),
  );
}

//! Waits for the job status to change and returns it
async function waitForJobStatus(id: string): Promise<ReplayCommandResponse> {
  // The timeout is 2 cycles of the worker
  const timeout = 2 * configData.WORKER_PERIOD_REPLAY_START_STOP;

  return new Promise<ReplayCommandResponse>((resolve, reject) => {
    const onEvent = (data: ReplayCommandResponse) => {
      // Cancels the timeout timer
      clearTimeout(timer);
      // Return successfull data
      resolve(data);
    };

    // Timer rejects the promise with timeout error if it elapses before the event
    const timer = setTimeout(() => {
      // Unsubscribes from the events
      statusChange.off(id, onEvent);
      // Return the error
      reject(new TimeoutError());
    }, timeout);

    // Subscribe to status change events for this job ID
    statusChange.once(id, onEvent);
  });
}

export const ReplayWorker = {
  waitForJobStatus,
  checkStartStopJobs,
};

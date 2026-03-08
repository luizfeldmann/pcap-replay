import { configData } from "../utils/config.js";
import EventEmitter from "events";
import { TimeoutError } from "../utils/error.js";
import { ReplayService } from "../services/replay.js";
import { ReplayRow, ReplayRowStatus } from "../models/replay.js";
import { GetReplayArgs } from "shared";
import { FilesService } from "../services/files.js";
import { spawn } from "child_process";

//! Notifies when the status of a job has changed
const statusChange = new EventEmitter();

//! The data stored on the status change events queue
type StatusChangeEventSnapshot = ReturnType<typeof ReplayService.setJobState>;

// Abort signals per job ID
const abortHandles: Record<string, AbortController> = {};

//! Sets the new state of a job in DB and notifies observers
async function setStateAndNotify(id: string, state: ReplayRowStatus) {
  const snapshot = await ReplayService.setJobState(id, state);
  statusChange.emit(id, snapshot);
}

async function runJobUnsafe(jobRow: ReplayRow) {
  // Collect all the other tables related to the job
  const job = await ReplayService.getJobDetails(jobRow);

  // Compile the arguments
  const filepath = FilesService.getFilePathOnDisk(job.fileId);
  const args = [...GetReplayArgs(job), filepath];

  // Spawn the process
  const controller = new AbortController();
  abortHandles[job.id] = controller;

  const process = spawn("tcpreplay-edit", args, { signal: controller.signal });

  // Collect console prints
  const onPipe = (chunk: any) => {
    console.log(chunk.toString());
  };

  process.stdout.on("data", onPipe);
  process.stderr.on("data", onPipe);

  // Handle exist code
  process.once("close", async (code, signal) => {
    // Unregister the abort signal
    delete abortHandles[job.id];

    // Treat the exit condition
    if (signal) {
      // Process was stopped by a signal
      await setStateAndNotify(job.id, "STOPPED");
    } else if (code === 0) {
      // Exit with success code
      console.error(`completed successfully: '${job.id}' - '${job.name}'`);
      await setStateAndNotify(job.id, "FINISHED");
    } else {
      // Exit with error code
      console.error(
        `exited with error: code ${code} for '${job.id}' - '${job.name}'`,
      );
      await setStateAndNotify(job.id, "ERROR");
    }
  });

  // Return a promise attached to the result of the process startup
  return new Promise<void>((resolve, reject) => {
    process.once("spawn", resolve);
    process.once("error", reject);
  });
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

async function stopJob(job: ReplayRow) {
  abortHandles[job.id]?.abort();
}

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
async function waitForJobStatus(
  id: string,
): Promise<StatusChangeEventSnapshot> {
  // The timeout is 2 cycles of the worker
  const timeout = 2 * configData.WORKER_PERIOD_REPLAY_START_STOP;

  return new Promise<StatusChangeEventSnapshot>((resolve, reject) => {
    const onEvent = (data: StatusChangeEventSnapshot) => {
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

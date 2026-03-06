import { configData } from "../utils/config";
import EventEmitter from "events";
import { TimeoutError } from "../utils/error";
import { ReplayService } from "../services/replay";
import { ReplayRow, ReplayRowStatus } from "../models/replay";

//! Notifies when the status of a job has changed
const statusChange = new EventEmitter();

//! The data stored on the status change events queue
type StatusChangeEventSnapshot = ReturnType<typeof ReplayService.setJobState>;

//! Sets the new state of a job in DB and notifies observers
async function setStateAndNotify(id: string, state: ReplayRowStatus) {
  const snapshot = await ReplayService.setJobState(id, state);
  statusChange.emit(id, snapshot);
}

async function runJob(job: ReplayRow) {
  // TODO: actual logic
  await setStateAndNotify(job.id, "RUNNING");
}

async function stopJob(job: ReplayRow) {
  // TODO: actual logic
  await setStateAndNotify(job.id, "STOPPED");
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

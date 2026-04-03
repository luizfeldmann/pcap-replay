import EventEmitter from "events";
import { configData } from "../utils/config.js";
import { TimeoutError } from "../utils/error.js";
import { ReplayService } from "../services/replay.js";
import {
  ReplayProviderEnum,
  ReplayRow,
  ReplayRowStatus,
} from "../models/replay.js";
import { ReplayCommandResponse } from "shared";
import { IReplayProvider } from "./replayProvider.js";
import { UdpReplayProvider } from "./udpreplay.js";
import { TcpReplayProvider } from "./tcpreplay.js";

// Maps the providers keys to their implementations
const providersRegistry: Record<ReplayProviderEnum, IReplayProvider> = {
  udpreplay: new UdpReplayProvider(),
  tcpreplay: new TcpReplayProvider(),
};

//! Notifies when the status of a job has changed
const statusChange = new EventEmitter();

//! Sets the new state of a job in DB and notifies observers
async function setStateAndNotify(id: string, state: ReplayRowStatus) {
  const snapshot = await ReplayService.setJobState(id, state);
  statusChange.emit(id, snapshot);
}

async function runJob(provider: IReplayProvider, job: ReplayRow) {
  try {
    // Try to run the job
    await provider.start(job, setStateAndNotify);

    // Update state if succesful
    await setStateAndNotify(job.id, "RUNNING");
  } catch (err) {
    console.error(`failed to start job '${job.id}' - '${job.name}': ${err}`);

    // Change job to error state if unable to start
    await setStateAndNotify(job.id, "ERROR");
  }
}

//! Periodically check status of jobs and performs the start/stop
async function checkStartStopJobs() {
  // Get all jobs in the REQUEST_* state
  const jobs = await ReplayService.getScheduledJobs();

  // Execute the actual run/stop for each one
  await Promise.all(
    jobs.map((job) => {
      const provider = providersRegistry[job.provider];

      if (job.status === "REQUEST_RUN") return runJob(provider, job);
      else if (job.status === "REQUEST_STOP") return provider.stop(job);
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

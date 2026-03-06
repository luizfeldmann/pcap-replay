import { FilesService } from "../services/files";
import { ReplayService } from "../services/replay";
import { configData } from "../utils/config";

// Invokes all housekeeping tasks on startup
export async function performHousekeeping() {
  await Promise.all([
    ReplayService.cancelStaleJobs(),
    // ... add other tasks here
  ]);
}

//! Stores the timeout invoker for the workers
const timeoutHandles: Record<string, NodeJS.Timeout> = {};

//! Schedules the execution of one worker function
function registerWorker(name: string, period: number, cb: () => Promise<void>) {
  timeoutHandles[name] = setTimeout(() => {
    cb()
      .catch((err) => console.warn(`worker '${name}' error: ${err}`))
      .finally(() => registerWorker(name, period, cb));
  }, period);
}

//! Starts all background tasks
export function startWorkers() {
  registerWorker(
    "softdelete",
    configData.WORKER_PERIOD_SOFT_DELETE,
    FilesService.deleteSoftFiles,
  );
}

//! Stops all background tasks
export function stopWorkers() {
  // Clear each registered worker
  Object.values(timeoutHandles).forEach((item) => clearTimeout(item));
}

import {
  AddressRemap,
  JobCommand,
  PortRemap,
  ReplayListItem,
  ReplayPatch,
  ReplayPost,
  ReplayStatus,
  PaginatedReplayListRequest,
  PaginatedReplayListResponse,
  RepeatSettings,
  LengthSettings,
  LoadSettings,
  ReplayCommandResponse,
} from "shared";
import { db } from "../models/db.js";
import { ReplaysTable, ReplayRow, ReplayRowStatus } from "../models/replay.js";
import { PortRemapTable, PortRemapRow } from "../models/portremap.js";
import { AddressRemapTable, AddressRemapRow } from "../models/addressremap.js";
import { eq, lt, desc, inArray, and, sql } from "drizzle-orm";
import {
  ConflictError,
  ResourceLockedError,
  ResourceNotFoundError,
  UnknownError,
} from "../utils/error.js";
import { getLastItem } from "../utils/utils.js";
import { ReplayWorker } from "../workers/replay.js";
import { SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";

const transformPortRemap = (portRemap: PortRemapRow): PortRemap =>
  portRemap.start === portRemap.end
    ? {
        from: portRemap.start,
        to: portRemap.to,
      }
    : {
        from: {
          start: portRemap.start,
          end: portRemap.end,
        },
        to: portRemap.to,
      };

const transformAddrRemap = (addrRemap: AddressRemapRow): AddressRemap => ({
  from: addrRemap.from,
  to: addrRemap.to,
  ip: addrRemap.ip,
});

const statusTransformList: Record<ReplayRowStatus, ReplayStatus> = {
  ERROR: "ERROR",
  FINISHED: "FINISHED",
  REQUEST_RUN: "RUNNING",
  RUNNING: "RUNNING",
  REQUEST_STOP: "STOPPED",
  STOPPED: "STOPPED",
};

const transformListItem = (
  replayJob: ReplayRow,
  portRemaps: PortRemapRow[],
  addrRemaps: AddressRemapRow[],
) => {
  // Base fields
  const item: ReplayListItem = {
    id: replayJob.id,
    fileId: replayJob.file,
    name: replayJob.name,
    interface: replayJob.interface,
    status: statusTransformList[replayJob.status],
    createdTime: replayJob.createdTime.toISOString(),
    startTime: replayJob.startTime?.toISOString(),
    endTime: replayJob.endTime?.toISOString(),
  };

  // Port remapping
  if (portRemaps.length) item.portRemap = portRemaps.map(transformPortRemap);

  // Separate sourc and destination remaps
  const remapPartition = addrRemaps.reduce<{
    remapSrc: AddressRemapRow[];
    remapDst: AddressRemapRow[];
  }>(
    (acc, curr) => {
      switch (curr.direction) {
        case "dst":
          acc.remapDst.push(curr);
          break;
        case "src":
          acc.remapSrc.push(curr);
          break;
      }
      return acc;
    },
    { remapSrc: [], remapDst: [] },
  );

  // Address remapping
  if (remapPartition.remapSrc.length)
    item.srcRemap = remapPartition.remapSrc.map(transformAddrRemap);

  if (remapPartition.remapDst.length)
    item.dstRemap = remapPartition.remapDst.map(transformAddrRemap);

  // Repetition settings
  if (replayJob.loop) {
    item.repeat = {
      type: "loop",
    };
  } else if (replayJob.repeat) {
    item.repeat = {
      type: "times",
      times: replayJob.repeat,
    };
  }

  // Speed settings
  if (replayJob.speedMultiplier) {
    item.load = {
      type: "multiplier",
      speed: replayJob.speedMultiplier,
    };
  } else if (replayJob.packetRate) {
    item.load = {
      type: "pps",
      packetRate: replayJob.packetRate,
    };
  } else if (replayJob.dataRate) {
    item.load = {
      type: "mbps",
      dataRate: replayJob.dataRate,
    };
  }

  // Limit settings
  if (replayJob.limitPackets) {
    item.limit = {
      type: "packets",
      maxPackets: replayJob.limitPackets,
    };
  } else if (replayJob.limitDuration) {
    item.limit = {
      type: "duration",
      maxDuration: replayJob.limitDuration,
    };
  }

  return item;
};

const getJobsList = async (
  req: PaginatedReplayListRequest,
): Promise<PaginatedReplayListResponse> => {
  const cursor = req.cursor ? new Date(req.cursor) : new Date();
  const jobs = await db
    .select()
    .from(ReplaysTable)
    .where(lt(ReplaysTable.createdTime, cursor))
    .orderBy(desc(ReplaysTable.createdTime))
    .limit(req.limit);

  const items = await Promise.all(
    jobs.map(async (replayJob) => {
      const [portRemaps, addrRemaps] = await Promise.all([
        // prettier-ignore
        db.select()
          .from(PortRemapTable)
          .where(eq(PortRemapTable.replayId, replayJob.id)),
        // prettier-ignore
        db.select()
          .from(AddressRemapTable)
          .where(eq(AddressRemapTable.replayId, replayJob.id)),
      ]);
      return transformListItem(replayJob, portRemaps, addrRemaps);
    }),
  );

  return {
    items,
    nextCursor: getLastItem(items)?.createdTime,
  };
};

const getSingle = async (id: string): Promise<ReplayListItem> => {
  const [[replayJob], portRemaps, addrRemaps] = await Promise.all([
    db.select().from(ReplaysTable).where(eq(ReplaysTable.id, id)),
    db.select().from(PortRemapTable).where(eq(PortRemapTable.replayId, id)),
    db
      .select()
      .from(AddressRemapTable)
      .where(eq(AddressRemapTable.replayId, id)),
  ]);

  if (!replayJob) throw new ResourceNotFoundError();

  return transformListItem(replayJob, portRemaps, addrRemaps);
};

const deleteSingle = (id: string) => {
  db.transaction((tx) => {
    const job = tx
      .select({ status: ReplaysTable.status })
      .from(ReplaysTable)
      .where(eq(ReplaysTable.id, id))
      .get();

    // Job with this ID does not exist
    if (!job) throw new ResourceNotFoundError();

    // Job is running and cannot be deleted
    if (job.status === "RUNNING") throw new ResourceLockedError();

    // Perform actual deletion
    const result = tx.delete(ReplaysTable).where(eq(ReplaysTable.id, id)).run();
    if (!result.changes) throw new UnknownError();
  });
};

const getRepeatSettings = (settings: RepeatSettings | null | undefined) => {
  let loop = false;
  let repeat = null;

  if (settings?.type === "loop") loop = true;
  else if (settings?.type === "times") repeat = settings.times;

  return { loop, repeat };
};

const getLengthSettings = (settings: LengthSettings | null | undefined) => {
  let limitDuration = null;
  let limitPackets = null;

  if (settings?.type === "duration") limitDuration = settings.maxDuration;
  else if (settings?.type === "packets") limitPackets = settings.maxPackets;

  return { limitDuration, limitPackets };
};

const getSpeedSettings = (settings: LoadSettings | null | undefined) => {
  let speedMultiplier = null;
  let dataRate = null;
  let packetRate = null;

  if (settings?.type === "multiplier") speedMultiplier = settings?.speed;
  else if (settings?.type === "mbps") dataRate = settings.dataRate;
  else if (settings?.type === "pps") packetRate = settings.packetRate;

  return { speedMultiplier, dataRate, packetRate };
};

const getRemapAddr = (
  id: string,
  remaps: AddressRemap[],
  direction: "src" | "dst",
): AddressRemapRow[] =>
  remaps.map((remap) => ({
    replayId: id,
    from: remap.from,
    to: remap.to,
    ip: remap.ip,
    direction,
  }));

const getRemapPort = (id: string, remaps: PortRemap[]) =>
  remaps.map((item): PortRemapRow => {
    // From can be a range or a single number
    const { start, end } =
      typeof item.from === "number"
        ? { start: item.from, end: item.from }
        : item.from;

    // make row
    return {
      replayId: id,
      start,
      end,
      to: item.to,
    };
  });

const insertNew = (post: ReplayPost): ReplayListItem => {
  const id = crypto.randomUUID();

  // Transform the job data
  const replayJob: ReplayRow = {
    id,
    name: post.name,
    file: post.fileId,
    interface: post.interface,
    status: "STOPPED",
    createdTime: new Date(),
    startTime: null,
    endTime: null,
    ...getRepeatSettings(post.repeat),
    ...getLengthSettings(post.limit),
    ...getSpeedSettings(post.load),
  };

  // Create port remaps
  const portRemaps: PortRemapRow[] = [];

  if (post.portRemap) {
    const remapRows = getRemapPort(id, post.portRemap);
    portRemaps.push(...remapRows);
  }

  // Create address remaps for source and destination
  const addrRemaps: AddressRemapRow[] = [];

  if (post.dstRemap) {
    const remapRows = getRemapAddr(id, post.dstRemap, "dst");
    addrRemaps.push(...remapRows);
  }

  if (post.srcRemap) {
    const remapRows = getRemapAddr(id, post.srcRemap, "src");
    addrRemaps.push(...remapRows);
  }

  // Perform all the insert transactions
  db.transaction((tx) => {
    tx.insert(ReplaysTable).values(replayJob).run();

    addrRemaps.forEach((remap) => {
      tx.insert(AddressRemapTable).values(remap).run();
    });

    portRemaps.forEach((remap) => {
      tx.insert(PortRemapTable).values(remap).run();
    });
  });

  return transformListItem(replayJob, portRemaps, addrRemaps);
};

const modifyItem = async (
  id: string,
  patch: ReplayPatch,
): Promise<ReplayListItem> => {
  // Add only changed items to the patch
  let updateValues: Partial<ReplayRow> = {};

  if (patch.name) updateValues.name = patch.name;
  if (patch.fileId) updateValues.file = patch.fileId;
  if (patch.interface) updateValues.interface = patch.interface;

  if (patch.limit !== undefined) {
    updateValues = {
      ...updateValues,
      ...getLengthSettings(patch.limit),
    };
  }

  if (patch.load !== undefined) {
    updateValues = {
      ...updateValues,
      ...getSpeedSettings(patch.load),
    };
  }

  if (patch.repeat !== undefined) {
    updateValues = {
      ...updateValues,
      ...getRepeatSettings(patch.repeat),
    };
  }

  // Create port remaps
  let portRemaps: PortRemapRow[] | undefined;
  if (patch.portRemap) portRemaps = getRemapPort(id, patch.portRemap);

  // Create address remaps for source and destination
  let addrRemaps: AddressRemapRow[] | undefined;

  if (patch.srcRemap) addrRemaps = getRemapAddr(id, patch.srcRemap, "src");
  if (patch.dstRemap) {
    const dstRemap = getRemapAddr(id, patch.dstRemap, "dst");
    if (!addrRemaps) addrRemaps = dstRemap;
    else addrRemaps.push(...dstRemap);
  }

  // Invoke the transaction
  db.transaction((tx) => {
    // Find the job and its current status
    const job = tx
      .select({ status: ReplaysTable.status })
      .from(ReplaysTable)
      .where(eq(ReplaysTable.id, id))
      .get();

    if (!job) throw new ResourceNotFoundError();

    if (job.status === "RUNNING")
      throw new ConflictError("Cannot modify while running");

    // If given address remaps, delete an recreate
    if (addrRemaps) {
      tx.delete(AddressRemapTable)
        .where(eq(AddressRemapTable.replayId, id))
        .run();

      addrRemaps.forEach((item) =>
        tx.insert(AddressRemapTable).values(item).run(),
      );
    }

    // If give port remaps are given, delete and recreate
    if (portRemaps) {
      tx.delete(PortRemapTable).where(eq(PortRemapTable.replayId, id)).run();

      portRemaps.forEach((item) =>
        tx.insert(PortRemapTable).values(item).run(),
      );
    }

    // Update the main replay table
    tx.update(ReplaysTable)
      .set(updateValues)
      .where(eq(ReplaysTable.id, id))
      .run();
  });

  // Perform a regular get on the item after the update
  return getSingle(id);
};

const commandStatus = async (
  id: string,
  command: JobCommand,
): Promise<ReplayCommandResponse> => {
  // Stores which are the acceptable prior states for each state transition
  const transitions = {
    start: {
      allowedStates: ["ERROR", "STOPPED", "FINISHED"],
      nextState: "REQUEST_RUN",
    },
    stop: {
      allowedStates: ["RUNNING"],
      nextState: "REQUEST_STOP",
    },
  } satisfies Record<
    JobCommand,
    { allowedStates: ReplayRowStatus[]; nextState: ReplayRowStatus }
  >;

  const transition = transitions[command];

  // To avoid a race where the status changes before registering the event,
  // must create the promise before any changes in the DB
  const statusChangePromise = ReplayWorker.waitForJobStatus(id);

  // Apply the transition to the jobs
  const [updatedRow] = await db
    .update(ReplaysTable)
    .set({ status: transition.nextState })
    .where(
      and(
        eq(ReplaysTable.id, id),
        inArray(ReplaysTable.status, transition.allowedStates),
      ),
    )
    .returning();

  // Check why it failed
  if (!updatedRow) {
    // Try to read the job which was NOT updated
    const [job] = await db
      .select({ status: ReplaysTable.status })
      .from(ReplaysTable)
      .where(eq(ReplaysTable.id, id));

    // Job ID does not exist
    if (!job) throw new ResourceNotFoundError();

    // State is not allowed for command
    throw new ConflictError(`Cannot ${command} from state ${job.status}`);
  }

  // Wait for the background worker to start the job, and get the status (success/fail)
  const snapshot = await statusChangePromise;

  // Return the new status and times
  return {
    id: snapshot.id,
    status: statusTransformList[snapshot.status],
    startTime: snapshot.startTime?.toISOString(),
    endTime: snapshot.endTime?.toISOString(),
  };
};

/** Housekeeping */

//! Stops jobs which were left running as the server stopped or crashed
const cancelStaleJobs = async () => {
  const cancelledJobs = await db
    .update(ReplaysTable)
    .set({ status: "STOPPED" })
    .where(
      inArray(ReplaysTable.status, ["RUNNING", "REQUEST_RUN", "REQUEST_STOP"]),
    )
    .returning({
      id: ReplaysTable.id,
      name: ReplaysTable.name,
    });

  cancelledJobs.forEach((item) =>
    console.log(`cancelled stale job '${item.id}': '${item.name}'`),
  );
};

//! Gets the jobs in the REQUEST_* state
const getScheduledJobs = async () =>
  db
    .select()
    .from(ReplaysTable)
    .where(inArray(ReplaysTable.status, ["REQUEST_RUN", "REQUEST_STOP"]));

//! Updates the job to a new state
const setJobState = async (id: string, status: ReplayRowStatus) => {
  // Create a patch with the new state
  const patch: SQLiteUpdateSetSource<typeof ReplaysTable> = { status };

  // Change the timestamps according to the new state
  switch (status) {
    case "RUNNING":
      patch.startTime = sql`CURRENT_TIMESTAMP`;
      patch.endTime = null;
      break;
    case "FINISHED":
    case "STOPPED":
    case "ERROR":
      patch.endTime = sql`CURRENT_TIMESTAMP`;
      break;
  }

  // Update and return the data
  const [updatedRow] = await db
    .update(ReplaysTable)
    .set(patch)
    .where(eq(ReplaysTable.id, id))
    .returning({
      id: ReplaysTable.id,
      status: ReplaysTable.status,
      startTime: ReplaysTable.startTime,
      endTime: ReplaysTable.endTime,
    });

  if (!updatedRow) throw new ResourceNotFoundError();

  return updatedRow;
};

// Expose services
export const ReplayService = {
  // API
  getJobsList,
  getSingle,
  deleteSingle,
  insertNew,
  modifyItem,
  commandStatus,
  // Internal use
  getScheduledJobs,
  setJobState,
  cancelStaleJobs,
};

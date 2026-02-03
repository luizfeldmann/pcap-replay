import {
  AddressRemap,
  JobCommand,
  PortRemap,
  ReplayListItem,
  ReplayPatch,
  ReplayPost,
  ReplayStatus,
} from "shared";
import { db } from "../models/db.js";
import {
  ReplaysTable,
  ReplayRow,
  PortRemapTable,
  AddressRemapTable,
  PortRemapRow,
  AddressRemapRow,
} from "../models/replay.js";
import { eq } from "drizzle-orm";
import {
  AppError,
  ConflictError,
  ResourceLockedError,
  ResourceNotFoundError,
  UnknownError,
} from "../utils/error.js";
import { StatusCodes } from "http-status-codes";

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

const statusTransformList: {
  [K in (typeof ReplaysTable.status.enumValues)[number]]: ReplayStatus;
} = {
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
    startTime: replayJob.startTime?.toISOString(),
    endTime: replayJob.endTime?.toISOString(),
  };

  // Port remapping
  if (addrRemaps.length) item.portRemap = portRemaps.map(transformPortRemap);

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

const getAll = async (): Promise<ReplayListItem[]> => {
  const jobs = await db.select().from(ReplaysTable);
  return await Promise.all(
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

const deleteSingle = async (id: string) => {
  await db.transaction((tx) => {
    const job = tx
      .select({ status: ReplaysTable.status })
      .from(ReplaysTable)
      .where(eq(ReplaysTable.id, id))
      .get();

    if (!job) throw new ResourceNotFoundError();

    if (job.status === "RUNNING") throw new ResourceLockedError();

    const result = tx.delete(ReplaysTable).where(eq(ReplaysTable.id, id)).run();
    if (!result.changes) throw new UnknownError();
  });
};

const insertNew = async (post: ReplayPost): Promise<ReplayListItem> => {
  const id = crypto.randomUUID();

  // Transform the job data
  let loop = false;
  let repeat = null;

  if (post.repeat?.type === "loop") loop = true;
  else if (post.repeat?.type === "times") repeat = post.repeat.times;

  let limitDuration = null;
  let limitPackets = null;

  if (post?.limit?.type === "duration") limitDuration = post.limit.maxDuration;
  else if (post.limit?.type === "packets") limitPackets = post.limit.maxPackets;

  let speedMultiplier = null;
  let dataRate = null;
  let packetRate = null;

  if (post?.load?.type === "multiplier") speedMultiplier = post.load?.speed;
  else if (post?.load?.type === "mbps") dataRate = post.load.dataRate;
  else if (post.load?.type === "pps") packetRate = post.load.packetRate;

  // Create the job itself
  const replayJob: ReplayRow = {
    id,
    name: post.name,
    file: post.fileId,
    interface: post.interface,
    status: "STOPPED",
    startTime: null,
    endTime: null,
    loop,
    repeat,
    limitDuration,
    limitPackets,
    speedMultiplier,
    dataRate,
    packetRate,
  };

  // Create port remaps
  const portRemaps: PortRemapRow[] = [];

  if (post.portRemap) {
    // In parallel, insert all port remaps in DB
    const remapRows = post.portRemap.map((remap): PortRemapRow => {
      // From can be a range or a single number
      const { start, end } =
        typeof remap.from === "number"
          ? { start: remap.from, end: remap.from }
          : remap.from;

      // make row
      return {
        replayId: id,
        start,
        end,
        to: remap.to,
      };
    });

    portRemaps.push(...remapRows);
  }

  // Create address remaps
  const remapAddrTransform = (
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

  const addrRemaps: AddressRemapRow[] = [];

  if (post.dstRemap) {
    const remapRows = remapAddrTransform(post.dstRemap, "dst");
    addrRemaps.push(...remapRows);
  }
  if (post.srcRemap) {
    const remapRows = remapAddrTransform(post.srcRemap, "src");
    addrRemaps.push(...remapRows);
  }

  // Perform all the insert transactions
  await db.transaction((tx) => {
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

const modifyItem = async (patch: ReplayPatch): Promise<ReplayListItem> => {
  // TODO: not implemented
  throw new AppError(
    "Not implemented",
    StatusCodes.NOT_IMPLEMENTED,
    "INTERNAL_ERROR",
  );
};

const commandStatus = async (id: string, command: JobCommand) => {
  await db.transaction((tx) => {
    // Find the job and its current status
    const job = tx
      .select({ status: ReplaysTable.status })
      .from(ReplaysTable)
      .where(eq(ReplaysTable.id, id))
      .get();

    if (!job) throw new ResourceNotFoundError();

    switch (command) {
      case "start":
        // Verify it can be started
        if (
          job.status === "RUNNING" ||
          job.status === "REQUEST_RUN" ||
          job.status === "REQUEST_STOP"
        )
          throw new ConflictError("Cannot start from this state");
        // Change to new state
        tx.update(ReplaysTable)
          .set({ status: "REQUEST_RUN" })
          .where(eq(ReplaysTable.id, id))
          .run();
        break;
      case "stop":
        // Verify its running so it can be stopped
        if (job.status != "RUNNING")
          throw new ConflictError("Cannot stop because it's not running");
        // Change to new state
        tx.update(ReplaysTable)
          .set({ status: "REQUEST_STOP" })
          .where(eq(ReplaysTable.id, id))
          .run();
        break;
    }
  });
};

export const ReplayService = {
  getAll,
  getSingle,
  deleteSingle,
  insertNew,
  modifyItem,
  commandStatus,
};

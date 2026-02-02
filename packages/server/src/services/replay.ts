import {
  AddressRemap,
  JobCommand,
  PortRemap,
  ReplayListItem,
  ReplayPatch,
  ReplayPost,
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
import { ResourceLockedError, ResourceNotFoundError } from "../utils/error.js";

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
    status: replayJob.status,
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
        db
          .select()
          .from(PortRemapTable)
          .where(eq(PortRemapTable.replayId, replayJob.id)),
        db
          .select()
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
  await db.transaction(async (tx) => {
    const [job] = await db
      .select({ status: ReplaysTable.status })
      .from(ReplaysTable)
      .where(eq(ReplaysTable.id, id));

    if (!job) throw new ResourceNotFoundError();

    if (job.status === "RUNNING") throw new ResourceLockedError();

    await db.delete(ReplaysTable).where(eq(ReplaysTable.id, id));
  });
};

const insertNew = async (post: ReplayPost): Promise<ReplayListItem> => {
  throw null;
};

const modifyItem = async (patch: ReplayPatch): Promise<ReplayListItem> => {
  throw null;
};

const commandStatus = async (id: string, command: JobCommand) => {
  throw null;
};

export const ReplayService = {
  getAll,
  getSingle,
  deleteSingle,
  insertNew,
  modifyItem,
  commandStatus,
};

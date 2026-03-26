import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { FilesTable } from "./files.js";

export const ReplaysTable = sqliteTable("replays", {
  id: text().primaryKey(),
  name: text().notNull(),
  file: text()
    .notNull()
    .references(() => FilesTable.id, { onDelete: "restrict" }),
  status: text({
    // prettier-ignore
    enum: [
      "REQUEST_STOP",
      "STOPPED",
      "REQUEST_RUN",
      "RUNNING",
      "FINISHED",
      "ERROR",
    ],
  }).notNull(),
  startTime: integer({ mode: "timestamp_ms" }),
  endTime: integer({ mode: "timestamp_ms" }),
  createdTime: integer({ mode: "timestamp_ms" }).notNull(),
  provider: text({ enum: ["tcpreplay", "dgram"] }).notNull(),
  interface: text(),
  verbose: integer({ mode: "boolean" }),
  loop: integer({ mode: "boolean" }),
  repeat: integer(),
  limitDuration: integer(),
  limitPackets: integer(),
  speedMultiplier: real(),
  dataRate: real(),
  packetRate: real(),
});

export type ReplayRow = InferSelectModel<typeof ReplaysTable>;
export type ReplayRowStatus = ReplayRow["status"];
export type ReplayProviderEnum = ReplayRow["provider"];

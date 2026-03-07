import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { FilesTable } from "./files";

export const ReplaysTable = sqliteTable("replays", {
  id: text().primaryKey(),
  name: text().notNull(),
  file: text()
    .notNull()
    .references(() => FilesTable.id, { onDelete: "restrict" }),
  interface: text().notNull(),
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

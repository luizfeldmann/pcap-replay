import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { FilesTable } from "./files";

export const ReplaysTable = sqliteTable("replays", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  file: text("file")
    .notNull()
    .references(() => FilesTable.id, { onDelete: "restrict" }),
  interface: text("file").notNull(),
  status: text("status", {
    enum: ["STOPPED", "RUNNING", "FINISHED", "ERROR"],
  }).notNull(),
  startTime: integer("uploaded_at", { mode: "timestamp_ms" }),
  endTime: integer("uploaded_at", { mode: "timestamp_ms" }),
  loop: integer("loop", { mode: "boolean" }),
  repeat: integer("repeat"),
  limitDuration: integer("limitDuration"),
  limitPackets: integer("limitPackets"),
  speedMultiplier: real("speedMultiplier"),
  dataRate: real("dataRate"),
  packetRate: real("packetRate"),
});

export type ReplayRow = InferSelectModel<typeof ReplaysTable>;

export const AddressRemapTable = sqliteTable("replays_addr_remap", {
  replayId: text("replayId")
    .primaryKey()
    .references(() => ReplaysTable.id, { onDelete: "cascade" }),
  direction: text("direction", { enum: ["src", "dst"] }).notNull(),
  ip: text("ip", { enum: ["v4", "v6"] }).notNull(),
  from: text("from").notNull(),
  to: text("to").notNull(),
});

export type AddressRemapRow = InferSelectModel<typeof AddressRemapTable>;

export const PortRemapTable = sqliteTable("replays_port_remap", {
  replayId: text("replayId")
    .primaryKey()
    .references(() => ReplaysTable.id, { onDelete: "cascade" }),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  to: integer("to").notNull(),
});

export type PortRemapRow = InferSelectModel<typeof PortRemapTable>;

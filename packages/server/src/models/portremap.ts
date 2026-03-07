import { InferSelectModel } from "drizzle-orm";
import { ReplaysTable } from "./replay.js";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const PortRemapTable = sqliteTable("replays_port_remap", {
  replayId: text("replayId").references(() => ReplaysTable.id, {
    onDelete: "cascade",
  }),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  to: integer("to").notNull(),
});

export type PortRemapRow = InferSelectModel<typeof PortRemapTable>;

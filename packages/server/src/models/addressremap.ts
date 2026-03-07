import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ReplaysTable } from "./replay";
import { InferSelectModel } from "drizzle-orm";

export const AddressRemapTable = sqliteTable("replays_addr_remap", {
  replayId: text().references(() => ReplaysTable.id, {
    onDelete: "cascade",
  }),
  direction: text({ enum: ["src", "dst"] }).notNull(),
  ip: text({ enum: ["v4", "v6"] }).notNull(),
  from: text().notNull(),
  to: text().notNull(),
});

export type AddressRemapRow = InferSelectModel<typeof AddressRemapTable>;

// packages/server/src/db/schema/files.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const FilesTable = sqliteTable("files", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  uploadedAt: integer("uploaded_at", { mode: "timestamp_ms" }).notNull(),
});

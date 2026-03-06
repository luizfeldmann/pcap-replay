import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// All files
export const FilesTable = sqliteTable("files", {
  id: text().primaryKey(),
  filename: text().notNull(),
  size: integer().notNull(),
  uploadedAt: integer({ mode: "timestamp_ms" }).notNull(),
});

export type FileRow = InferSelectModel<typeof FilesTable>;

// Only the deleted files
export const DeletedFilesTable = sqliteTable("deleteFiles", {
  id: text().primaryKey(),
  deletedAt: integer({ mode: "timestamp_ms" }).notNull().defaultNow(),
});

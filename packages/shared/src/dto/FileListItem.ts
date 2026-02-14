import { z } from "zod";
import { PaginatedRequestSchema } from "./PaginatedRequest";
import { PaginatedResponseSchema } from "./PaginatedResponse";

export const FileListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.int().positive(),
  time: z.iso.datetime(),
});

export type FileListItem = z.infer<typeof FileListItemSchema>;

export const FilePatchSchema = FileListItemSchema.pick({
  name: true,
}).partial();

export type FilePatch = z.infer<typeof FilePatchSchema>;

export const PaginatedFileListRequestSchema = PaginatedRequestSchema.extend({
  cursor: z.iso.datetime().optional(),
});

export type PaginatedFileListRequest = z.infer<
  typeof PaginatedFileListRequestSchema
>;

export const PaginatedFileListResponseSchema = PaginatedResponseSchema(
  FileListItemSchema,
).extend({
  nextCursor: z.iso.datetime().optional(),
});

export type PaginatedFileListResponse = z.infer<
  typeof PaginatedFileListResponseSchema
>;

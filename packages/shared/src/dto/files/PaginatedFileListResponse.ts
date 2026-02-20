import z from "zod";
import { PaginatedResponseSchema } from "../pagination/PaginatedResponse.js";
import { FileListItemSchema } from "./FileListItem.js";

export const PaginatedFileListResponseSchema = PaginatedResponseSchema(
  FileListItemSchema,
).extend({
  nextCursor: z.iso.datetime().optional(),
});

export type PaginatedFileListResponse = z.infer<
  typeof PaginatedFileListResponseSchema
>;

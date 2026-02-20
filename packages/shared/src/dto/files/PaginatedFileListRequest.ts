import z from "zod";
import { PaginatedRequestSchema } from "../pagination/PaginatedRequest.js";

export const PaginatedFileListRequestSchema = PaginatedRequestSchema.extend({
  cursor: z.iso.datetime().optional(),
});

export type PaginatedFileListRequest = z.infer<
  typeof PaginatedFileListRequestSchema
>;

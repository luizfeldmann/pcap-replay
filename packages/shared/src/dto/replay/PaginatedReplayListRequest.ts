import z from "zod";
import { PaginatedRequestSchema } from "../pagination/PaginatedRequest.js";

export const PaginatedReplayListRequestSchema = PaginatedRequestSchema.extend({
  cursor: z.iso.datetime().optional(),
});

export type PaginatedReplayListRequest = z.infer<
  typeof PaginatedReplayListRequestSchema
>;

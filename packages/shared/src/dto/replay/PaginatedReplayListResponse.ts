import z from "zod";
import { PaginatedResponseSchema } from "../pagination/PaginatedResponse.js";
import { ReplayListItemSchema } from "./ReplayListItem.js";

export const PaginatedReplayListResponseSchema = PaginatedResponseSchema(
  ReplayListItemSchema,
).extend({
  nextCursor: z.iso.datetime().optional(),
});

export type PaginatedReplayListResponse = z.infer<
  typeof PaginatedReplayListResponseSchema
>;

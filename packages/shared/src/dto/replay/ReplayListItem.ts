import { z } from "zod";
import { ReplayStatusSchema } from "./ReplayStatus.js";
import { ReplayPostSchema } from "./ReplayPost.js";

//! Schema for GET of a replay item
export const ReplayListItemSchema = z
  .object({
    id: z.string(),
    status: ReplayStatusSchema,
    createdTime: z.iso.datetime(),
    startTime: z.iso.datetime().optional(),
    endTime: z.iso.datetime().optional(),
  })
  .extend(ReplayPostSchema.shape);

export type ReplayListItem = z.infer<typeof ReplayListItemSchema>;

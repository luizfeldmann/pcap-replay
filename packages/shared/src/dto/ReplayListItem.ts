import { z } from "zod";
import { ReplayStatusSchema } from "./ReplayStatus.js";
import { ReplaySettingsSchema } from "./ReplaySettings.js";

//! Schema to POST a NEW replay item, mandatory fields
export const ReplayPostSchema = z
  .object({
    name: z.string(),
    fileId: z.string(),
  })
  .extend(ReplaySettingsSchema.shape);

export type ReplayPost = z.infer<typeof ReplayPostSchema>;

//! Schema to PATCH an EXISTING replay item
export const ReplayPatchSchema = ReplayPostSchema.partial();

export type ReplayPatch = z.infer<typeof ReplayPatchSchema>;

//! Schema for GET of a replay item
export const ReplayListItemSchema = z
  .object({
    id: z.string(),
    status: ReplayStatusSchema,
    startTime: z.iso.datetime().optional(),
    endTime: z.iso.datetime().optional(),
  })
  .extend(ReplayPatchSchema.shape);

export type ReplayListItem = z.infer<typeof ReplayListItemSchema>;

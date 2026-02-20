import z from "zod";
import { ReplaySettingsSchema } from "./ReplaySettings.js";

//! Schema to POST a NEW replay item, mandatory fields
export const ReplayPostSchema = z
  .object({
    name: z.string(),
    fileId: z.string(),
  })
  .extend(ReplaySettingsSchema.shape);

export type ReplayPost = z.infer<typeof ReplayPostSchema>;

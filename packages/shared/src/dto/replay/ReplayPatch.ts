import z from "zod";
import { ReplayPostSchema } from "./ReplayPost.js";

//! Schema to PATCH an EXISTING replay item
export const ReplayPatchSchema = ReplayPostSchema.extend({
  // undefined = not part of the patch
  // null = clear from DB
  repeat: ReplayPostSchema.shape.repeat.nullable(),
  limit: ReplayPostSchema.shape.limit.nullable(),
  load: ReplayPostSchema.shape.load.nullable(),
}).partial();

export type ReplayPatch = z.infer<typeof ReplayPatchSchema>;

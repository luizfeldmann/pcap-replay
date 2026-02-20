import z from "zod";
import { ReplayPostSchema } from "./ReplayPost.js";

//! Schema to PATCH an EXISTING replay item
export const ReplayPatchSchema = ReplayPostSchema.partial();

export type ReplayPatch = z.infer<typeof ReplayPatchSchema>;

import z from "zod";
import { ReplayListItemSchema } from "../../dto/replay/ReplayListItem.js";

export const ReplayPatchEventSchema = z.object({
  topic: z.literal("replay"),
  operation: z.literal("patch"),
  data: ReplayListItemSchema,
});

export type ReplayPatchEvent = z.infer<typeof ReplayPatchEventSchema>;

import { z } from "zod";
import { ReplayStatusSchema } from "./ReplayStatus";

export const ReplayListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  fileId: z.string(),
  status: ReplayStatusSchema,
  loop: z.boolean().optional().default(false),
  startTime: z.iso.datetime().optional(),
  endTime: z.iso.datetime().optional(),
});

export type ReplayListItem = z.infer<typeof ReplayListItemSchema>;

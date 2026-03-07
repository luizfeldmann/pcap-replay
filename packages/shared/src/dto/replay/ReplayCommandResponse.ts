import { z } from "zod";
import { ReplayListItemSchema } from "./ReplayListItem.js";

export const ReplayCommandResponseSchema = ReplayListItemSchema.pick({
  id: true,
  status: true,
  startTime: true,
  endTime: true,
});

export type ReplayCommandResponse = z.infer<typeof ReplayCommandResponseSchema>;

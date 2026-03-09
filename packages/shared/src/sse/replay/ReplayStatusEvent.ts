import z from "zod";
import { ReplayCommandResponseSchema } from "../../dto/replay/ReplayCommandResponse.js";

export const ReplayStatusEventSchema = z.object({
  topic: z.literal("replay"),
  operation: z.literal("status"),
  data: ReplayCommandResponseSchema,
});

export type ReplayStatusEvent = z.infer<typeof ReplayStatusEventSchema>;

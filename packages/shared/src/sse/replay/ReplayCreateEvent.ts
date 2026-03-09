import z from "zod";
import { ReplayListItemSchema } from "../../dto/replay/ReplayListItem.js";

export const ReplayCreatedEventSchema = z.object({
  topic: z.literal("replay"),
  operation: z.literal("create"),
  data: ReplayListItemSchema,
});

export type ReplayCreatedEvent = z.infer<typeof ReplayCreatedEventSchema>;

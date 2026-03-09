import z from "zod";
import { FileEventSchema } from "./files/FileEvent.js";
import { ReplayEventSchema } from "./replay/ReplayEvent.js";

export const SubscriptionEventSchema = z.discriminatedUnion("topic", [
  FileEventSchema,
  ReplayEventSchema,
]);

export type SubscriptionEvent = z.infer<typeof SubscriptionEventSchema>;

import z from "zod";
import { ReplayCreatedEventSchema } from "./ReplayCreateEvent.js";
import { ReplayDeleteEventSchema } from "./ReplayDeleteEvent.js";
import { ReplayPatchEventSchema } from "./ReplayPatchEvent.js";
import { ReplayStatusEventSchema } from "./ReplayStatusEvent.js";
import { ReplayLogEventSchema } from "./ReplayLogEvent.js";

export const ReplayEventSchema = z.discriminatedUnion("operation", [
  ReplayCreatedEventSchema,
  ReplayDeleteEventSchema,
  ReplayPatchEventSchema,
  ReplayStatusEventSchema,
  ReplayLogEventSchema,
]);

export type ReplayEvent = z.infer<typeof ReplayEventSchema>;

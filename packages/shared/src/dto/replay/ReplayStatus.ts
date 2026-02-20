import { z } from "zod";

export const ReplayStatusSchema = z.enum([
  "STOPPED",
  "RUNNING",
  "FINISHED",
  "ERROR",
]);

export type ReplayStatus = z.infer<typeof ReplayStatusSchema>;

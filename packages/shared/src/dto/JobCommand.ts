import { z } from "zod";

export const JobCommandSchema = z.enum(["start", "stop"]);

export type JobCommand = z.infer<typeof JobCommandSchema>;

import z from "zod";

export const ReplayLogEventSchema = z.object({
  topic: z.literal("replay"),
  operation: z.literal("log"),
  data: z.object({
    id: z.string(),
    logs: z.array(z.string()),
  }),
});

export type ReplayLogEvent = z.infer<typeof ReplayLogEventSchema>;

import z from "zod";

export const ReplayDeleteEventSchema = z.object({
  topic: z.literal("replay"),
  operation: z.literal("delete"),
  data: z.object({
    id: z.string(),
  }),
});

export type ReplayDeleteEvent = z.infer<typeof ReplayDeleteEventSchema>;

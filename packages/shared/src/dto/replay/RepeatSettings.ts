import z from "zod";

export const RepeatSettingsSchema = z.union([
  z.object({
    type: z.literal("loop"),
  }),
  z.object({
    type: z.literal("times"),
    times: z.int().min(1),
  }),
]);

export type RepeatSettings = z.infer<typeof RepeatSettingsSchema>;

import z from "zod";

export const RepeatLoopSettingsSchema = z.object({
  type: z.literal("loop"),
});

export const RepeatTimesSettingsSchema = z.object({
  type: z.literal("times"),
  times: z.int().min(1),
});

//! Defines the repetition mode of a replay job
export const RepeatSettingsSchema = z.discriminatedUnion("type", [
  RepeatLoopSettingsSchema,
  RepeatTimesSettingsSchema,
]);

export type RepeatSettings = z.infer<typeof RepeatSettingsSchema>;

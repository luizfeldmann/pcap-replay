import z from "zod";

export const ReplayLengthLimits = {
  duration: {
    min: 1,
  },
  packets: {
    min: 1,
  },
};

//! Defines a maximum time duration of a replay job
export const LimitDurationSettingsSchema = z.object({
  type: z.literal("duration"),
  maxDuration: z.number().min(ReplayLengthLimits.duration.min),
});

export type LimitDurationSettings = z.infer<typeof LimitDurationSettingsSchema>;

//! Defines a maximum number of packets of a replay job
export const LimitMaxPacketsSettingsSchema = z.object({
  type: z.literal("packets"),
  maxPackets: z.number().min(ReplayLengthLimits.packets.min),
});

export type LimitMaxPacketsSettings = z.infer<
  typeof LimitMaxPacketsSettingsSchema
>;

//! Defines length limitations, only one may be present
export const LengthSettingsSchema = z.discriminatedUnion("type", [
  LimitDurationSettingsSchema,
  LimitMaxPacketsSettingsSchema,
]);

export type LengthSettings = z.infer<typeof LengthSettingsSchema>;

import z from "zod";

export const ReplayLengthLimits = {
  duration: {
    min: 1,
  },
  packets: {
    min: 1,
  },
};

//! Defines length limitations, only one may be present
export const LengthSettingsSchema = z.union([
  z.object({
    type: z.literal("duration"),
    maxDuration: z.number().min(ReplayLengthLimits.duration.min),
  }),
  z.object({
    type: z.literal("packets"),
    maxPackets: z.number().min(ReplayLengthLimits.packets.min),
  }),
]);

export type LengthSettings = z.infer<typeof LengthSettingsSchema>;

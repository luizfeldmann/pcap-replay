import z from "zod";

export const ReplayLoadLimits = {
  multiplier: {
    min: 0.1,
    max: 5.0,
  },
  mbps: {
    min: 1,
    max: 100,
  },
  pps: {
    min: 0,
  },
};

//! Defines load settings, only one may be present
export const LoadSettingsSchema = z.union([
  z.object({
    type: z.literal("multiplier"),
    speed: z
      .number()
      .min(ReplayLoadLimits.multiplier.min)
      .max(ReplayLoadLimits.multiplier.max),
  }),
  z.object({
    type: z.literal("mbps"),
    dataRate: z
      .number()
      .min(ReplayLoadLimits.mbps.min)
      .max(ReplayLoadLimits.mbps.max),
  }),
  z.object({
    type: z.literal("pps"),
    packetRate: z.number().min(ReplayLoadLimits.pps.min),
  }),
]);

export type LoadSettings = z.infer<typeof LoadSettingsSchema>;

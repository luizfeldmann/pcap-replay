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
    max: 1000,
  },
};

//! Configures a speed multiplier for the replay
export const MultiplierSettingsSchema = z.object({
  type: z.literal("multiplier"),
  speed: z
    .number()
    .min(ReplayLoadLimits.multiplier.min)
    .max(ReplayLoadLimits.multiplier.max),
});

export type MultiplierSettings = z.infer<typeof MultiplierSettingsSchema>;

//! Configures the data rate of the replay
export const DataRateSettingsSchema = z.object({
  type: z.literal("mbps"),
  dataRate: z
    .number()
    .min(ReplayLoadLimits.mbps.min)
    .max(ReplayLoadLimits.mbps.max),
});

export type DataRateSettings = z.infer<typeof DataRateSettingsSchema>;

//! Configures the packet rate of the replay
export const PacketRateSettingsSchema = z.object({
  type: z.literal("pps"),
  packetRate: z
    .number()
    .min(ReplayLoadLimits.pps.min)
    .max(ReplayLoadLimits.pps.max),
});

export type PacketRateSettings = z.infer<typeof PacketRateSettingsSchema>;

//! Defines load settings, only one may be present
export const LoadSettingsSchema = z.discriminatedUnion("type", [
  MultiplierSettingsSchema,
  DataRateSettingsSchema,
  PacketRateSettingsSchema,
]);

export type LoadSettings = z.infer<typeof LoadSettingsSchema>;

//! Types of load limiting settings
export type LoadSettingsType = LoadSettings["type"];

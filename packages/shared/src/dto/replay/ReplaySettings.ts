import { z } from "zod";
import { PortRemapSchema } from "./PortRemap.js";
import { AddressRemapSchema } from "./AddressRemap.js";
import {
  LoadSettingsSchema,
  MultiplierSettingsSchema,
} from "./LoadSettings.js";
import { LengthSettingsSchema } from "./LengthSettings.js";
import { RepeatSettingsSchema } from "./RepeatSettings.js";

export const ReplaySettingsCommonSchema = z.object({
  portRemap: z.array(PortRemapSchema).optional(),
  dstRemap: z.array(AddressRemapSchema).optional(),
  limit: LengthSettingsSchema.optional().nullable(),
  repeat: RepeatSettingsSchema.optional().nullable(),
  verbose: z.boolean().optional(),
});

export type ReplaySettingsCommon = z.infer<typeof ReplaySettingsCommonSchema>;

//! Replay settings for when using the DGRAM provider
export const ReplaySettingsDgramSchema = z
  .object({
    provider: z.literal("dgram"),
    load: MultiplierSettingsSchema.optional().nullable(),
    verbose: z.boolean().optional(),
  })
  .extend(ReplaySettingsCommonSchema.shape);

export type ReplaySettingsDgram = z.infer<typeof ReplaySettingsDgramSchema>;

//! Replay settings for when using the TCPREPLAY provider
export const ReplaySettingsTcpReplaySchema = z
  .object({
    provider: z.literal("tcpreplay"),
    interface: z.string(),
    srcRemap: z.array(AddressRemapSchema).optional(),
    load: LoadSettingsSchema.optional(),
  })
  .extend(ReplaySettingsCommonSchema.shape);

export type ReplaySettingsTcpReplay = z.infer<
  typeof ReplaySettingsTcpReplaySchema
>;

// Full replay job settings
export const ReplaySettingsSchema = z.discriminatedUnion("provider", [
  ReplaySettingsDgramSchema,
  ReplaySettingsTcpReplaySchema,
]);

export type ReplaySettings = z.infer<typeof ReplaySettingsSchema>;

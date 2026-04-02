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

//! Replay settings for when using the UDPREPLAY provider
export const ReplaySettingsUdpReplaySchema = z
  .object({
    provider: z.literal("udpreplay"),
    interface: z.string().optional(),
    load: MultiplierSettingsSchema.optional().nullable(),
  })
  .extend(ReplaySettingsCommonSchema.shape);

export type ReplaySettingsUdpReplay = z.infer<
  typeof ReplaySettingsUdpReplaySchema
>;

//! Replay settings for when using the TCPREPLAY provider
export const ReplaySettingsTcpReplaySchema = z
  .object({
    provider: z.literal("tcpreplay"),
    interface: z.string(),
    load: LoadSettingsSchema.optional().nullable(),
    srcRemap: z.array(AddressRemapSchema).optional(),
  })
  .extend(ReplaySettingsCommonSchema.shape);

export type ReplaySettingsTcpReplay = z.infer<
  typeof ReplaySettingsTcpReplaySchema
>;

// Full replay job settings
export const ReplaySettingsSchema = z.discriminatedUnion("provider", [
  ReplaySettingsUdpReplaySchema,
  ReplaySettingsTcpReplaySchema,
]);

export type ReplaySettings = z.infer<typeof ReplaySettingsSchema>;

//! Types of replay providers
export type ReplayProviderEnum = ReplaySettings["provider"];

import { z } from "zod";

// Number of a single network port
const PortNumber = z.int().min(0).max(65535);

//! Range of network ports
export const PortRangeSchema = z.object({
  start: PortNumber,
  end: PortNumber,
});

export type PortRange = z.infer<typeof PortRangeSchema>;

//! Defines a remapping from a matching port/range to a remapped port
const PortRemapSchema = z.object({
  from: z.union([PortNumber, PortRangeSchema]),
  to: PortNumber,
});

export type PortRemap = z.infer<typeof PortRemapSchema>;

//! Defines subnets for IP remapping
export const AddressRemapSchema = z.union([
  z.object({
    ip: z.literal("v4"),
    from: z.cidrv4(),
    to: z.cidrv4(),
  }),
  z.object({
    ip: z.literal("v6"),
    from: z.cidrv6(),
    to: z.cidrv6(),
  }),
]);

export type AddressRemap = z.infer<typeof AddressRemapSchema>;

//! Defines load settings, only one may be present
const LoadSettingsSchema = z.union([
  z.object({
    type: z.literal("multiplier"),
    speed: z.number().min(0.1).max(5.0),
  }),
  z.object({
    type: z.literal("mbps"),
    dataRate: z.number().min(1).max(100),
  }),
  z.object({
    type: z.literal("pps"),
    packetRate: z.number().min(0),
  }),
]);

//! Defines length limitations, only one may be present
const LengthSettingsSchema = z.union([
  z.object({
    type: z.literal("duration"),
    maxDuration: z.number().min(1),
  }),
  z.object({
    type: z.literal("packets"),
    maxPackets: z.number().min(1),
  }),
]);

const RepeatSettingsSchema = z.union([
  z.object({
    type: z.literal("loop"),
  }),
  z.object({
    type: z.literal("times"),
    times: z.int().min(1),
  }),
]);

// Full replay job settings
export const ReplaySettingsSchema = z.object({
  interface: z.string(),
  portRemap: z.array(PortRemapSchema).optional(),
  srcRemap: z.array(AddressRemapSchema).optional(),
  dstRemap: z.array(AddressRemapSchema).optional(),
  load: LoadSettingsSchema.optional(),
  limit: LengthSettingsSchema.optional(),
  repeat: RepeatSettingsSchema.optional(),
});

export type ReplaySettings = z.infer<typeof ReplaySettingsSchema>;

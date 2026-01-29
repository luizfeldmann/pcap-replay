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
    from: z.cidrv4(),
    to: z.cidrv4(),
  }),
  z.object({
    from: z.cidrv6(),
    to: z.cidrv6(),
  }),
]);

export type AddressRemap = z.infer<typeof AddressRemapSchema>;

//! Defines speed settings, only one may be present
const SpeedSettingsSchema = z.union([
  z.object({
    multiplier: z.number().min(0.1).max(5.0),
  }),
  z.object({
    dataRate: z.number().min(1).max(100),
  }),
  z.object({
    packetRate: z.number().min(0),
  }),
]);

//! Defines length limitations, only one may be present
const LengthSettingsSchema = z.union([
  z.object({
    maxDuration: z.number().min(1),
  }),
  z.object({
    maxPackets: z.number().min(1),
  }),
]);

const RepeatSettingsSchema = z.union([
  z.object({
    loop: z.literal(true),
  }),
  z.object({
    times: z.int().min(1),
  }),
]);

// Full replay job settings
export const ReplaySettingsSchema = z.object({
  interface: z.string(),
  portRemap: z.array(PortRemapSchema).optional(),
  srcRemap: z.array(AddressRemapSchema).optional(),
  dstRemap: z.array(AddressRemapSchema).optional(),
  speed: SpeedSettingsSchema.optional(),
  limit: LengthSettingsSchema.optional(),
  repeat: RepeatSettingsSchema.optional(),
});

export type ReplaySettings = z.infer<typeof ReplaySettingsSchema>;

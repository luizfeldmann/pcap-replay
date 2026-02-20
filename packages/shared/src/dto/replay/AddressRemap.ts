import z from "zod";

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

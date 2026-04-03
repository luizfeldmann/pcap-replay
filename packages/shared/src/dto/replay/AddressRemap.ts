import z from "zod";

export const AddressRemapV4Schema = z.object({
  ip: z.literal("v4"),
  from: z.cidrv4(),
  to: z.cidrv4(),
});

export const AddressRemapV6Schema = z.object({
  ip: z.literal("v6"),
  from: z.cidrv6(),
  to: z.cidrv6(),
});

//! Defines subnets for IP remapping
export const AddressRemapSchema = z.discriminatedUnion("ip", [
  AddressRemapV4Schema,
  AddressRemapV6Schema,
]);

export type AddressRemap = z.infer<typeof AddressRemapSchema>;

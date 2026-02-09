import { z } from "zod";

export const NetworkInterfaceAddressSchema = z.union([
  z.object({
    family: z.literal("IPv4"),
    address: z.ipv4(),
    netmask: z.ipv4(),
    cidr: z.cidrv4(),
    mac: z.mac(),
    internal: z.boolean(),
  }),
  z.object({
    family: z.literal("IPv6"),
    address: z.ipv6(),
    netmask: z.ipv6(),
    cidr: z.cidrv6(),
    mac: z.mac(),
    internal: z.boolean(),
  }),
]);

export type NetworkInterfaceAddress = z.infer<
  typeof NetworkInterfaceAddressSchema
>;

export const NetworkInterfaceSchema = z.object({
  name: z.string(),
  addr: z.array(NetworkInterfaceAddressSchema),
});

export type NetworkInterface = z.infer<typeof NetworkInterfaceSchema>;

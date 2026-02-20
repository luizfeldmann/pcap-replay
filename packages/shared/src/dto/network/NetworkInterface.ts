import { z } from "zod";
import { NetworkInterfaceAddressSchema } from "./NetworkInterfaceAddress";

export const NetworkInterfaceSchema = z.object({
  name: z.string(),
  addr: z.array(NetworkInterfaceAddressSchema),
});

export type NetworkInterface = z.infer<typeof NetworkInterfaceSchema>;

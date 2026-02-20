import z from "zod";

//! Number of a single network port
export const PortNumber = z.int().min(0).max(65535);

//! Range of network ports
export const PortRangeSchema = z.object({
  start: PortNumber,
  end: PortNumber,
});

export type PortRange = z.infer<typeof PortRangeSchema>;

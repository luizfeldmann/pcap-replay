import z from "zod";
import { PortNumber, PortRangeSchema } from "./PortRange.js";

//! Defines a remapping from a matching port/range to a remapped port
export const PortRemapSchema = z.object({
  from: z.union([PortNumber, PortRangeSchema]),
  to: PortNumber,
});

export type PortRemap = z.infer<typeof PortRemapSchema>;

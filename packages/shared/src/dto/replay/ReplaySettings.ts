import { z } from "zod";
import { PortRemapSchema } from "./PortRemap.js";
import { AddressRemapSchema } from "./AddressRemap.js";
import { LoadSettingsSchema } from "./LoadSettings.js";
import { LengthSettingsSchema } from "./LengthSettings.js";
import { RepeatSettingsSchema } from "./RepeatSettings.js";

// Full replay job settings
export const ReplaySettingsSchema = z.object({
  interface: z.string(),
  portRemap: z.array(PortRemapSchema).optional(),
  srcRemap: z.array(AddressRemapSchema).optional(),
  dstRemap: z.array(AddressRemapSchema).optional(),
  load: LoadSettingsSchema.optional(),
  limit: LengthSettingsSchema.optional(),
  repeat: RepeatSettingsSchema.optional(),
  verbose: z.boolean().optional(),
});

export type ReplaySettings = z.infer<typeof ReplaySettingsSchema>;

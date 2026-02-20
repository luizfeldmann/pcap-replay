import { z } from "zod";
import { FileListItemSchema } from "./FileListItem.js";

export const FilePatchSchema = FileListItemSchema.pick({
  name: true,
}).partial();

export type FilePatch = z.infer<typeof FilePatchSchema>;

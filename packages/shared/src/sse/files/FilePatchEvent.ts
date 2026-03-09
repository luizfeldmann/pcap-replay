import z from "zod";
import { FileListItemSchema } from "../../dto/files/FileListItem.js";

export const FilePatchEventSchema = z.object({
  topic: z.literal("file"),
  operation: z.literal("patch"),
  data: FileListItemSchema,
});

export type FilePatchEvent = z.infer<typeof FilePatchEventSchema>;

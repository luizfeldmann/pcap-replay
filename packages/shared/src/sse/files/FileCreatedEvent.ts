import z from "zod";
import { FileListItemSchema } from "../../dto/files/FileListItem.js";

export const FileCreatedEventSchema = z.object({
  topic: z.literal("file"),
  operation: z.literal("create"),
  data: FileListItemSchema,
});

export type FileCreatedEvent = z.infer<typeof FileCreatedEventSchema>;

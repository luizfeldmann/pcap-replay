import { z } from "zod";

export const FileListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.int().positive(),
  time: z.iso.datetime(),
});

export type FileListItem = z.infer<typeof FileListItemSchema>;

import z from "zod";

export const FileDeletedEventSchema = z.object({
  topic: z.literal("file"),
  operation: z.literal("delete"),
  data: z.object({
    id: z.string(),
  }),
});

export type FileDeletedEvent = z.infer<typeof FileDeletedEventSchema>;

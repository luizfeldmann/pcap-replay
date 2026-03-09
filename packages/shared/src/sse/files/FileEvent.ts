import z from "zod";
import { FileCreatedEventSchema } from "./FileCreatedEvent.js";
import { FileDeletedEventSchema } from "./FileDeletedEvent.js";
import { FilePatchEventSchema } from "./FilePatchEvent.js";

export const FileEventSchema = z.discriminatedUnion("operation", [
  FileCreatedEventSchema,
  FileDeletedEventSchema,
  FilePatchEventSchema,
]);

export type FileEvent = z.infer<typeof FileEventSchema>;

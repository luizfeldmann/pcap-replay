import { z } from "zod";

export const ErrorCodeSchema = z.enum([
  "INTERNAL_ERROR",
  "BAD_FILE_TYPE",
  "BAD_FILE_SIZE",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

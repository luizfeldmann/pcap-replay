import { z } from "zod";

export const ErrorCodeSchema = z.enum([
  "INTERNAL_ERROR",
  "REQUEST_VALIDATION",
  "NOT_FOUND",
  "RESOURCE_LOCKED",
  "CONFLICT",
  "BAD_FILE_TYPE",
  "BAD_FILE_SIZE",
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

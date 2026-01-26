import { z } from "zod";
import { ErrorCodeSchema } from "./ErrorCode.js";

export const ErrorResponseSchema = z.object({
  message: z.string(),
  code: ErrorCodeSchema,
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

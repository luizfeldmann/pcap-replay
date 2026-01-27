import { ErrorResponseSchema } from "shared";
import { z } from "zod";
import { createSchema } from "zod-openapi";

export const jsonResponse = (zodSchema: z.ZodTypeAny, description = "OK") => {
  const openSchema = createSchema(zodSchema);
  return {
    description,
    content: {
      "application/json": {
        schema: openSchema.schema,
      },
    },
  };
};

export const defaultErrorResponse = (description: string = "Error") =>
  jsonResponse(ErrorResponseSchema, description);

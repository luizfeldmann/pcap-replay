import { ErrorResponseSchema } from "shared";
import { z } from "zod";
import {
  createSchema,
  ZodOpenApiRequestBodyObject,
  ZodOpenApiResponseObject,
} from "zod-openapi";

export const jsonResponse = (
  zodSchema: z.ZodTypeAny,
  description = "OK",
): ZodOpenApiResponseObject => {
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

export const eventStreamResponse = (
  zodSchema: z.ZodTypeAny,
  description = "Event Stream",
): ZodOpenApiResponseObject => {
  const openSchema = createSchema(zodSchema);
  return {
    description,
    content: {
      "text/event-stream": {
        schema: openSchema.schema,
      },
    },
  };
};

export const jsonRequestBody = (
  zodSchema: z.ZodTypeAny,
  description = "Request body",
): ZodOpenApiRequestBodyObject => {
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

export const fileDownloadResponse = (
  description: string = "File contents",
) => ({
  description,
  contents: {
    "application/octet-stream": {
      schema: {
        type: "string",
        format: "binary",
      },
    },
  },
});

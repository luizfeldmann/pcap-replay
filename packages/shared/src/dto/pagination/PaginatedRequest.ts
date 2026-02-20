import { z } from "zod";

export const PaginatedRequestSchema = z.object({
  limit: z.coerce.number().int().min(1),
  cursor: z.string().optional(),
});

export type PaginatedRequest = z.infer<typeof PaginatedRequestSchema>;

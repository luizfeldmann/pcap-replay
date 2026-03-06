import { z } from "zod";

//! Define schema for environment variables
const envSchema = z.object({
  //! Server port number
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),
  //! Destination directory for file uploads
  UPLOAD_DIR: z.string().default("data/uploads"),
  //! File path to the embedded database
  DATABASE_FILE: z.string().default("data/sqlite.db"),
  //! Maximum allowable update size
  MAX_FILE_SIZE_MB: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(100),
  // Period to run soft delete background tasks
  WORKER_PERIOD_SOFT_DELETE: z.int().min(0).default(5000),
});

// Parse environment variables into the object
const envParse = envSchema.safeParse(process.env);

// Raise validation errors
if (!envParse.success) {
  console.error(
    "Invalid environment variables: ",
    z.treeifyError(envParse.error),
  );
  process.exit(1);
}

// Export the parsed env
export const configData = envParse.data;

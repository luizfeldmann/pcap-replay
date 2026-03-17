import { z } from "zod";

//! Configs when using HTTP
const httpConfig = z.object({
  ENABLE_HTTPS: z.literal(false),
  //! Server port number when using HTTP
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
});

// When using HTTPS
const httpsConfig = z.object({
  ENABLE_HTTPS: z.literal(true),
  //! Server port number when using HTTPS
  PORT: z.coerce.number().int().min(0).max(65535).default(3443),
  //! TLS files
  TLS_KEY_PATH: z.string(),
  TLS_CERT_PATH: z.string(),
});

//! Discrimination for HTTP or HTTPS modes
const protoConfig = z
  .looseObject({
    ENABLE_HTTPS: z.coerce.boolean().default(false),
  })
  .pipe(z.discriminatedUnion("ENABLE_HTTPS", [httpConfig, httpsConfig]));

//! Define schema for environment variables
const envSchema = z
  .object({
    //! Destination directory for file uploads
    UPLOAD_DIR: z.string().default("data/uploads"),
    //! File path to the embedded database
    DATABASE_FILE: z.string().default("data/sqlite.db"),
    //! Maximum allowable update size
    MAX_FILE_SIZE_MB: z.coerce.number().default(100),
    // Period to run soft delete background tasks
    WORKER_PERIOD_SOFT_DELETE: z.coerce.number().int().min(0).default(5000),
    // Period to check for start/stop of replay jobs
    WORKER_PERIOD_REPLAY_START_STOP: z.coerce
      .number()
      .int()
      .min(0)
      .default(2000),
  })
  .and(protoConfig);

// Parse environment variables into the object
const envParse = envSchema.safeParse(process.env);

// Raise validation errors
if (!envParse.success) {
  console.error(
    "Invalid environment variables: ",
    z.flattenError(envParse.error).fieldErrors,
  );
  process.exit(1);
}

// Export the parsed env
export const configData = envParse.data;

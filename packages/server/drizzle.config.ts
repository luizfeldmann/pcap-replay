import type { Config } from "drizzle-kit";

export default {
  schema: ["./src/models/files.ts"],
  out: "./data/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/sqlite.db",
  },
} satisfies Config;

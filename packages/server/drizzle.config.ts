import type { Config } from "drizzle-kit";

export default {
  schema: [
    "./src/models/files.ts",
    "./src/models/replay.ts",
    "./src/models/portremap.ts",
    "./src/models/addressremap.ts",
  ],
  out: "./data/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/sqlite.db",
  },
} satisfies Config;

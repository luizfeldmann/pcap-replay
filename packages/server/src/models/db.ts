import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { configData } from "../utils/config.js";

const sqlite = new Database(configData.DATABASE_FILE);
export const db = drizzle(sqlite);

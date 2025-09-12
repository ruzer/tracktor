import "dotenv/config";
import * as schema from "@db/schema/index.js";
import { drizzle } from "drizzle-orm/libsql";

const path =
  process.env.DATABASE_PATH || process.env.DB_PATH || "./tracktor.db";

const db = drizzle({
  connection: { url: `file:${path}` },
  casing: "snake_case",
  schema: {
    ...schema,
  },
});

export { db };

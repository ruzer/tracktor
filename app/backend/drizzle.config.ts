import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  migrations: {
    prefix: "timestamp",
    table: "_migrations",
  },
  schema: "./src/db/schema",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${process.env.DATABASE_PATH! || "./tracktor.db"}`,
  },
  casing: "snake_case",
});

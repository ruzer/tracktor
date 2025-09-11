import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { seedData } from "@db/seeders/index.js";
import { config as dotenvConfig } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the project root (../../.env)
dotenvConfig({ path: path.resolve(process.cwd(), "../../.env"), override: true });

// Ensure we load env from the project root when running via tsx
// This allows DATABASE_PATH and other variables to be read consistently
// regardless of the current working directory.
const db = drizzle({
  connection: { url: `file:${process.env.DATABASE_PATH || "./tracktor.db"}` },
  casing: "snake_case",
});

const migrationsFolder = path.join(__dirname, "migrations");

async function runMigrations() {
  try {
    console.log("🔄 Running database migrations...");
    await migrate(db, { migrationsFolder });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

async function runSeed() {
  try {
    console.log("🌱 Seeding database...");
    await seedData();
    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

const command = process.argv[2];

switch (command) {
  case "migrate":
    await runMigrations();
    break;
  case "seed":
    await runSeed();
    break;
  default:
    console.log("Usage: tsx migrate.ts [migrate|seed]");
    process.exit(1);
}

process.exit(0);

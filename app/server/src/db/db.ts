import { config } from "dotenv";
import { Sequelize } from "sequelize";

config({ quiet: false, debug: true });

const showSql = process.env.SHOW_SQL === "true" || false;

const db = new Sequelize({
  dialect: "sqlite",
  storage: `${process.env.DB_PATH || "./vehicles.db"}`, // Use environment variable for database path
  logging: showSql,
});

export { db };

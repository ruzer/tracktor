import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${process.env.DB_PATH || './vehicles.db'}`, // Use environment variable for database path
  logging: process.env.SHOW_SQL==='true' || true,
});

export default sequelize;

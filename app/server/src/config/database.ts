import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${process.env.DB_PATH || './vehicles.db'}`, // Use environment variable for database path
  logging: false, // Set to true to see SQL queries in console
});

export default sequelize;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './vehicles.db',
    logging: true, // Set to true to see SQL queries in console
});

export default sequelize;

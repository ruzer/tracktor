import type { Migration } from '../index.js';

export const up: Migration = ({ context: queryInterface }) => {

    return queryInterface.sequelize.sync({
        alter: true
    });
}
export const down: Migration = ({ context: queryInterface }) => {
    return queryInterface.dropAllSchemas();
}
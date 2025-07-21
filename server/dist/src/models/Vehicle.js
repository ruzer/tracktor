import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class Vehicle extends Model {
}
Vehicle.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    vin: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    odometer: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'vehicles',
    timestamps: false,
    sequelize,
});
export default Vehicle;
//# sourceMappingURL=Vehicle.js.map
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Insurance from './Insurance.js';
import PollutionCertificate from './PollutionCertificate.js';
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
Vehicle.hasOne(Insurance, { foreignKey: 'vehicleId', as: 'insurance' });
Insurance.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Vehicle.hasOne(PollutionCertificate, { foreignKey: 'vehicleId', as: 'pollutionCertificate' });
PollutionCertificate.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
export default Vehicle;
//# sourceMappingURL=Vehicle.js.map
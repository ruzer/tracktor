import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import Vehicle from './Vehicle.js';
class FuelLog extends Model {
}
FuelLog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehicle,
            key: 'id',
        },
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    odometer: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fuelAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'fuel_logs',
    timestamps: false,
    sequelize,
});
// Associations
Vehicle.hasMany(FuelLog, { foreignKey: 'vehicleId', onDelete: 'CASCADE' });
FuelLog.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
export default FuelLog;
//# sourceMappingURL=FuelLog.js.map
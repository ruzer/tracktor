import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import Vehicle from './Vehicle.js';

interface FuelLogAttributes {
    id: number;
    vehicleId: number;
    date: string; // DATEONLY type in Sequelize maps to string in TS
    odometer: number;
    fuelAmount: number;
    cost: number;
    notes?: string;
}

interface FuelLogCreationAttributes extends Optional<FuelLogAttributes, 'id'> {}

class FuelLog extends Model<FuelLogAttributes, FuelLogCreationAttributes> implements FuelLogAttributes {
    public declare id: number;
    public declare vehicleId: number;
    public declare date: string;
    public declare odometer: number;
    public declare fuelAmount: number;
    public declare cost: number;
    public declare notes?: string;
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
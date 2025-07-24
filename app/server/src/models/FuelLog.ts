import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface FuelLogAttributes {
    id: number;
    vehicleId: number;
    date: string;
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
        type: DataTypes.UUIDV4,
        primaryKey: true
    },
    vehicleId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'Vehicle',
            key: 'id',
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            notEmpty: true,
        }
    },
    odometer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0,
        }
    },
    fuelAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0,
        }
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 500],
        }
    },
}, {
    tableName: 'fuel_logs',
    timestamps: true,
    underscored: true,
    sequelize,
});
export default FuelLog;
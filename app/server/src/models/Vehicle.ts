import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface VehicleAttributes {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin?: string;
    color?: string;
    odometer?: number;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id'> {}

class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
    public declare id: string;
    public declare make: string;
    public declare model: string;
    public declare year: number;
    public declare licensePlate: string;
    public declare vin?: string;
    public declare color?: string;
    public declare odometer?: number;
}

Vehicle.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1886, // The year the first car was invented
            max: new Date().getFullYear() + 1
        },
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [1, 15], // Assuming a maximum length for license plates
        },
    },
    vin: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
            is: /^[A-HJ-NPR-Z0-9]{17}$/, // VIN must be 17 characters long, excluding I, O, and Q
        },
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,

    },
    odometer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
            min: 0, // Odometer cannot be negative
        }
    },
}, {
    tableName: 'vehicles',
    timestamps: true,
    underscored: true,
    sequelize,
});

export default Vehicle;
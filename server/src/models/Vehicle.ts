import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface VehicleAttributes {
    id: number;
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
    public declare id: number;
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
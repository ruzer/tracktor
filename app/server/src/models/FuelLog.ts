import { DataTypes, Model, Optional } from "sequelize";
import { db } from "../db/index.js";
import Vehicle from "./Vehicle.js";

interface FuelLogAttributes {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  fuelAmount: number;
  cost: number;
  notes?: string;
}

interface FuelLogCreationAttributes extends Optional<FuelLogAttributes, "id"> { }

class FuelLog
  extends Model<FuelLogAttributes, FuelLogCreationAttributes>
  implements FuelLogAttributes {
  declare public id: string;
  declare public vehicleId: string;
  declare public date: string;
  declare public odometer: number;
  declare public fuelAmount: number;
  declare public cost: number;
  declare public notes?: string;
}

FuelLog.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
      },
    },
    odometer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
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
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },
  },
  {
    tableName: "fuel_logs",
    timestamps: true,
    underscored: true,
    sequelize: db,
  },
);
export default FuelLog;

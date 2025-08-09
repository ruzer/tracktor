import { DataTypes, Model, Optional } from "sequelize";
import { db } from "../db/index.js";
import Vehicle from "./Vehicle.js";
import { FuelLogError } from "../exceptions/FuelLogError.js";
import { Status } from "../exceptions/ServiceError.js";

interface FuelLogAttributes {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  fuelAmount: number;
  cost: number;
  notes?: string;
}

interface FuelLogCreationAttributes extends Optional<FuelLogAttributes, "id"> {}

class FuelLog
  extends Model<FuelLogAttributes, FuelLogCreationAttributes>
  implements FuelLogAttributes
{
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
    },
    odometer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        async validateOdometer(value: number) {
          const maxOdometer: number = await FuelLog.max("odometer", {
            where: {
              vehicleId: this.vehicleId as string,
            },
          });

          const vehicle = await Vehicle.findOne({
            where: {
              id: this.vehicleId as string,
            },
            attributes: ["odometer"],
          });

          const vehicleOdometer = vehicle?.odometer || 0;

          if (value <= maxOdometer || value <= vehicleOdometer) {
            throw new FuelLogError(
              "Odometer Reading must be greater than current vehicle odometer.",
              Status.BAD_REQUEST,
            );
          }
        },
      },
    },
    fuelAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Fuel Amount must be greater than 0.",
        },
      },
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Fuel Amount must be greater than 0.",
        },
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Notes must be lesser than 500 length.",
        },
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

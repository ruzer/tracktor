import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";

interface MaintenanceLogAttributes {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  service: string;
  cost: number;
  notes?: string;
}

interface MaintenanceLogCreationAttributes
  extends Optional<MaintenanceLogAttributes, "id"> {}

class MaintenanceLog
  extends Model<MaintenanceLogAttributes, MaintenanceLogCreationAttributes>
  implements MaintenanceLogAttributes
{
  public declare id: string;
  public declare vehicleId: string;
  public declare date: string;
  public declare odometer: number;
  public declare service: string;
  public declare cost: number;
  public declare notes: string;
}

MaintenanceLog.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Vehicle, 
        key: "id",
      },
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
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
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
        notEmpty: true
      },
    },
  },
  {
    tableName: "maintenance_logs",
    timestamps: true,
    underscored: true,
    sequelize,
  }
);

export default MaintenanceLog;

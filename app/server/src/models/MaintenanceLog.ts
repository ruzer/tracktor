import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

interface MaintenanceLogAttributes {
  id: number;
  vehicleId: number;
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
  public id!: number;
  public vehicleId!: number;
  public date!: string;
  public odometer!: number;
  public service!: string;
  public cost!: number;
  public notes?: string;
}

MaintenanceLog.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Vehicle", // Use string reference
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

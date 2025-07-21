import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";

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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    },
    odometer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize,
    tableName: "maintenance_logs",
    timestamps: true,
  }
);

export default MaintenanceLog;

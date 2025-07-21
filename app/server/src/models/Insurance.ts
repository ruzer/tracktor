import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";

interface InsuranceAttributes {
  id: number;
  vehicleId: number;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  cost: number;
}

interface InsuranceCreationAttributes
  extends Optional<InsuranceAttributes, "id"> {}

class Insurance
  extends Model<InsuranceAttributes, InsuranceCreationAttributes>
  implements InsuranceAttributes
{
  public id!: number;
  public vehicleId!: number;
  public provider!: string;
  public policyNumber!: string;
  public startDate!: string;
  public endDate!: string;
  public cost!: number;
}

Insurance.init(
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
      unique: true, // Each vehicle can have one insurance policy
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "insurances",
    timestamps: true,
  }
);

export default Insurance;

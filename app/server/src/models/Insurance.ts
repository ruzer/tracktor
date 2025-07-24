import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

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
      type: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.UUIDV4,
      references: {
        model: "Vehicle", // Use string reference
        key: "id",
      },
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
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
  },
  {
    tableName: "insurances",
    timestamps: true,
    underscored: true,
    sequelize
  }
);

export default Insurance;

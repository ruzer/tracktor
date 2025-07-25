import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";

interface InsuranceAttributes {
  id: string;
  vehicleId: string;
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
  public declare id: string;
  public declare vehicleId: string;
  public declare provider: string;
  public declare policyNumber: string;
  public declare startDate: string;
  public declare endDate: string;
  public declare cost: number;
}

Insurance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.UUIDV4,
      references: {
        model: Vehicle,
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

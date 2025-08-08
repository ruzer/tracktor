import { DataTypes, Model, Optional } from "sequelize";
import { db } from "../db/index.js";
import Vehicle from "./Vehicle.js";
import { InsuranceServiceError } from "../exceptions/InsuranceError.js";

interface InsuranceAttributes {
  id: string;
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  cost: number;
  notes?: string;
}

interface InsuranceCreationAttributes
  extends Optional<InsuranceAttributes, "id"> {}

class Insurance
  extends Model<InsuranceAttributes, InsuranceCreationAttributes>
  implements InsuranceAttributes
{
  declare public id: string;
  declare public vehicleId: string;
  declare public provider: string;
  declare public policyNumber: string;
  declare public startDate: string;
  declare public endDate: string;
  declare public cost: number;
  declare public notes?: string;
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
        len: {
          args: [3, 50],
          msg: "Provider must be between length 3 to 50.",
        },
      },
    },
    policyNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: "Provider must be between length 3 to 50.",
        },
        is: {
          args: "^[0-9A-Za-z\s\-]*$",
          msg: "Only number and characters with space and hyphen are allowed in policy number.",
        },
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
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
    tableName: "insurances",
    timestamps: true,
    underscored: true,
    sequelize: db,
    validate: {
      async validateDates() {
        const previousInsEndDate = await Insurance.max("endDate", {
          where: {
            vehicleId: this.vehicleId as string,
          },
        });

        const sDate = new Date(this.startDate as string);
        const eDate = new Date(this.endDate as string);
        const maxEndDate = new Date(previousInsEndDate as string);

        if (sDate >= eDate) {
          throw new InsuranceServiceError(
            "Start date must always be before end date.",
          );
        }

        if (sDate < maxEndDate) {
          throw new InsuranceServiceError(
            "Start date must always be after previous insurance end date.",
          );
        }
      },
    },
  },
);

export default Insurance;

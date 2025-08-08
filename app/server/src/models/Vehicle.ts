import { DataTypes, Model, Optional } from "sequelize";
import { db } from "../db/index.js";
import { VehicleExistsError, VehicleServiceError } from "../exceptions/VehicleErrors.js";

interface VehicleAttributes {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  odometer?: number;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, "id"> { }

class Vehicle
  extends Model<VehicleAttributes, VehicleCreationAttributes>
  implements VehicleAttributes {
  declare public id: string;
  declare public make: string;
  declare public model: string;
  declare public year: number;
  declare public licensePlate: string;
  declare public vin?: string;
  declare public color?: string;
  declare public odometer?: number;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: "Manufacturer must be between length 3 to 50."
        }
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: "Model must be between length 3 to 50."
        }
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: {
          args: [1886],
          msg: "Year should be grater than 1886(when first car was invented)."
        },
        max: {
          args: [new Date().getFullYear()],
          msg: "Year should be less than current year."
        },
      },
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: "^[A-Z0-9\- ]{2,10}$",
          msg: "Licence Plate format is incorrect."
        }
      },
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: "^[A-HJ-NPR-Z0-9]{17}$",
          msg: "VIN number format is incorrect."
        },
        async isUnique(value: string) {
          if (!value) return;
          const existingVehicles = await db.getQueryInterface().select(null, "vehicles", {
            where: {
              vin: value
            }
          });
          if (existingVehicles.length > 0) {
            throw new VehicleExistsError();
          }
        }
      }

    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
          msg: "Only hex color codes are allowed."
        }
      }
    },
    odometer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: true,
        min: {
          args: [0],
          msg: "Odometer must always be non negative."
        }
      },
    },
  },
  {
    tableName: "vehicles",
    timestamps: true,
    underscored: true,
    sequelize: db,
  },
);

export default Vehicle;

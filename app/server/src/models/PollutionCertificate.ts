import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";

interface PollutionCertificateAttributes {
  id: number;
  vehicleId: number;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  testingCenter: string;
  notes?: string;
}

interface PollutionCertificateCreationAttributes
  extends Optional<PollutionCertificateAttributes, "id"> {}

class PollutionCertificate
  extends Model<PollutionCertificateAttributes, PollutionCertificateCreationAttributes>
  implements PollutionCertificateAttributes
{
  public id!: number;
  public vehicleId!: number;
  public certificateNumber!: string;
  public issueDate!: string;
  public expiryDate!: string;
  public testingCenter!: string;
  public notes?: string;
}

PollutionCertificate.init(
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
      unique: true, // Each vehicle can have one pollution certificate
    },
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    testingCenter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "pollution_certificates",
    timestamps: true,
  }
);

export default PollutionCertificate;

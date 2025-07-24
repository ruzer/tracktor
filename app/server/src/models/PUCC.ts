import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

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
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Vehicle", // Use string reference
        key: "id",
      },
      allowNull: false
    },
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    testingCenter: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: "pollution_certificates",
    timestamps: true,
    underscored: true,
  }
);

export default PollutionCertificate;

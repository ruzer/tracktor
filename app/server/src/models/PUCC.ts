import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";

interface PollutionCertificateAttributes {
  id: string;
  vehicleId: string;
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
  public declare id: string;
  public declare vehicleId: string;
  public declare certificateNumber: string;
  public declare issueDate: string;
  public declare expiryDate: string;
  public declare testingCenter: string;
  public declare notes: string;
}

PollutionCertificate.init(
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
        model: Vehicle, // Use string reference
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

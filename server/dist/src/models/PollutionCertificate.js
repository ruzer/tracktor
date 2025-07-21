import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";
class PollutionCertificate extends Model {
    id;
    vehicleId;
    certificateNumber;
    issueDate;
    expiryDate;
    testingCenter;
    notes;
}
PollutionCertificate.init({
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
}, {
    sequelize,
    tableName: "pollution_certificates",
    timestamps: true,
});
export default PollutionCertificate;
//# sourceMappingURL=PollutionCertificate.js.map
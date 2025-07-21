import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";
class Insurance extends Model {
    id;
    vehicleId;
    provider;
    policyNumber;
    startDate;
    endDate;
    cost;
}
Insurance.init({
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
}, {
    sequelize,
    tableName: "insurances",
    timestamps: true,
});
export default Insurance;
//# sourceMappingURL=Insurance.js.map
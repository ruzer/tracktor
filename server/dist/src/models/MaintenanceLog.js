import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Vehicle from "./Vehicle.js";
class MaintenanceLog extends Model {
    id;
    vehicleId;
    date;
    odometer;
    service;
    cost;
    notes;
}
MaintenanceLog.init({
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
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    odometer: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: "maintenance_logs",
    timestamps: true,
});
export default MaintenanceLog;
//# sourceMappingURL=MaintenanceLog.js.map
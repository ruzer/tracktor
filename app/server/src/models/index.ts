import Vehicle from "./Vehicle.js";
import Insurance from "./Insurance.js";
import MaintenanceLog from "./MaintenanceLog.js";
import FuelLog from "./FuelLog.js";
import PollutionCertificate from "./PUCC.js";
import Auth from "./Auth.js";
import Config from "./Config.js";

// Associations
Vehicle.hasOne(Insurance, { foreignKey: "vehicleId", as: "insurance" });
Insurance.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });

Vehicle.hasOne(PollutionCertificate, {
  foreignKey: "vehicleId",
  as: "pollutionCertificate",
});
PollutionCertificate.belongsTo(Vehicle, {
  foreignKey: "vehicleId",
  as: "vehicle",
});

Vehicle.hasMany(MaintenanceLog, {
  foreignKey: "vehicleId",
  as: "maintenanceLogs",
});
MaintenanceLog.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });

Vehicle.hasMany(FuelLog, { foreignKey: "vehicleId", as: "fuelLogs" });
FuelLog.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });

export {
  Vehicle,
  Insurance,
  MaintenanceLog,
  FuelLog,
  PollutionCertificate,
  Auth,
  Config,
};

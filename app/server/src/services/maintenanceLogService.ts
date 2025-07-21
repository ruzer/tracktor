
import MaintenanceLog from "../models/MaintenanceLog.js";
import Vehicle from "../models/Vehicle.js";

export const addMaintenanceLog = async (
  vehicleId: string,
  maintenanceLogData: any
) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const maintenanceLog = await MaintenanceLog.create({
      ...maintenanceLogData,
      vehicleId: parseInt(vehicleId),
    });
    return {
      id: maintenanceLog.id,
      message: "Maintenance log added successfully.",
    };
  } catch (error: any) {
    throw new Error("Error adding maintenance log.");
  }
};

export const getMaintenanceLogs = async (vehicleId: string) => {
  try {
    const maintenanceLogs = await MaintenanceLog.findAll({
      where: { vehicleId: parseInt(vehicleId) },
      order: [
        ["date", "ASC"],
        ["odometer", "ASC"],
      ],
    });
    return maintenanceLogs;
  } catch (error: any) {
    throw new Error("Error fetching maintenance logs.");
  }
};

export const getMaintenanceLogById = async (id: string) => {
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      throw new Error("Maintenance log not found.");
    }
    return maintenanceLog;
  } catch (error: any) {
    throw new Error("Error fetching maintenance log.");
  }
};

export const updateMaintenanceLog = async (
  id: string,
  maintenanceLogData: any
) => {
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      throw new Error("Maintenance log not found.");
    }

    await maintenanceLog.update(maintenanceLogData);
    return { message: "Maintenance log updated successfully." };
  } catch (error: any) {
    throw new Error("Error updating maintenance log.");
  }
};

export const deleteMaintenanceLog = async (id: string) => {
  try {
    const result = await MaintenanceLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new Error("Maintenance log not found.");
    }
    return { message: "Maintenance log deleted successfully." };
  } catch (error: any) {
    throw new Error("Error deleting maintenance log.");
  }
};

import { MaintenanceLog, Vehicle } from "../models/index.js";
import {
  MaintenanceLogNotFoundError,
  MaintenanceLogServiceError
} from "../exceptions/MaintenanceLogErrors.js";

export const addMaintenanceLog = async (
  vehicleId: string,
  maintenanceLogData: any
) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new MaintenanceLogNotFoundError("Vehicle not found.");
    }

    const maintenanceLog = await MaintenanceLog.create({
      ...maintenanceLogData,
      vehicleId: parseInt(vehicleId),
    });
    return {
      id: maintenanceLog.id,
      message: "Maintenance log added successfully.",
    };
  } catch (error: unknown) {
    if (error instanceof MaintenanceLogNotFoundError) {
      throw error;
    }
    throw new MaintenanceLogServiceError("Error adding maintenance log.");
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
  } catch (error: unknown) {
    throw new MaintenanceLogServiceError("Error fetching maintenance logs.");
  }
};

export const getMaintenanceLogById = async (id: string) => {
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      throw new MaintenanceLogNotFoundError();
    }
    return maintenanceLog;
  } catch (error: unknown) {
    if (error instanceof MaintenanceLogNotFoundError) {
      throw error;
    }
    throw new MaintenanceLogServiceError("Error fetching maintenance log.");
  }
};

export const updateMaintenanceLog = async (
  id: string,
  maintenanceLogData: any
) => {
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      throw new MaintenanceLogNotFoundError();
    }

    await maintenanceLog.update(maintenanceLogData);
    return { message: "Maintenance log updated successfully." };
  } catch (error: unknown) {
    if (error instanceof MaintenanceLogNotFoundError) {
      throw error;
    }
    throw new MaintenanceLogServiceError("Error updating maintenance log.");
  }
};

export const deleteMaintenanceLog = async (id: string) => {
  try {
    const result = await MaintenanceLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new MaintenanceLogNotFoundError();
    }
    return { message: "Maintenance log deleted successfully." };
  } catch (error: unknown) {
    if (error instanceof MaintenanceLogNotFoundError) {
      throw error;
    }
    throw new MaintenanceLogServiceError("Error deleting maintenance log.");
  }
};

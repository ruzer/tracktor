import { MaintenanceLog, Vehicle } from "../models/index.js";
import { MaintenanceLogError } from "../exceptions/MaintenanceLogError.js";
import { Status, statusFromError } from "../exceptions/ServiceError.js";

export const addMaintenanceLog = async (
  vehicleId: string,
  maintenanceLogData: any,
) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new MaintenanceLogError(
        `No vehicle found for id ${vehicleId}`,
        Status.NOT_FOUND,
      );
    }

    const maintenanceLog = await MaintenanceLog.create({
      ...maintenanceLogData,
      vehicleId: vehicleId,
    });
    return {
      id: maintenanceLog.id,
      message: "Maintenance log added successfully.",
    };
  } catch (error: any) {
    console.error("Add Maintenance log: ", error);
    throw new MaintenanceLogError(error.message, statusFromError(error));
  }
};

export const getMaintenanceLogs = async (vehicleId: string) => {
  try {
    const maintenanceLogs = await MaintenanceLog.findAll({
      where: { vehicleId: vehicleId },
      order: [
        ["date", "ASC"],
        ["odometer", "ASC"],
      ],
    });
    return maintenanceLogs;
  } catch (error: any) {
    console.error("Get Maintenance logs: ", error);
    throw new MaintenanceLogError(error.message, statusFromError(error));
  }
};

export const getMaintenanceLogById = async (id: string) => {
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      throw new MaintenanceLogError(
        `No Maintenence log found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return maintenanceLog;
  } catch (error: any) {
    console.error("Get maintenance log By Id: ", error);
    throw new MaintenanceLogError(error.message, statusFromError(error));
  }
};

export const updateMaintenanceLog = async (
  id: string,
  maintenanceLogData: any,
) => {
  try {
    const maintenanceLog = await MaintenanceLog.findByPk(id);
    if (!maintenanceLog) {
      throw new MaintenanceLogError(
        `No Maintenence log found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }

    await maintenanceLog.update(maintenanceLogData);
    return { message: "Maintenance log updated successfully." };
  } catch (error: any) {
    console.error("Update Maintenance log: ", error);
    throw new MaintenanceLogError(error.message, statusFromError(error));
  }
};

export const deleteMaintenanceLog = async (id: string) => {
  try {
    const result = await MaintenanceLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new MaintenanceLogError(
        `No Maintenence log found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return { message: "Maintenance log deleted successfully." };
  } catch (error: any) {
    console.error("Delete maintenance log: ", error);
    throw new MaintenanceLogError(error.message, statusFromError(error));
  }
};

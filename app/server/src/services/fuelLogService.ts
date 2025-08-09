import { FuelLogError } from "../exceptions/FuelLogError.js";
import { Status, statusFromError } from "../exceptions/ServiceError.js";
import { VehicleError } from "../exceptions/VehicleError.js";
import { Vehicle, FuelLog } from "../models/index.js";

export const addFuelLog = async (vehicleId: string, fuelLogData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new VehicleError(
        `No vehicle found for id : ${vehicleId}`,
        Status.NOT_FOUND,
      );
    }
    const fuelLog = await FuelLog.create({
      ...fuelLogData,
      vehicleId: vehicleId,
    });
    return { id: fuelLog.id, message: "Fuel log added successfully." };
  } catch (error: any) {
    console.error("Add Fuel Log : ", error);
    throw new FuelLogError(error.message, statusFromError(error));
  }
};

export const getFuelLogs = async (vehicleId: string) => {
  try {
    const fuelLogs = await FuelLog.findAll({
      where: { vehicleId: vehicleId },
      order: [
        ["date", "ASC"],
        ["odometer", "ASC"],
      ],
    });

    // Calculate mileage
    return fuelLogs.map((log, index, arr) => {
      if (index > 0) {
        const prevLog = arr[index - 1];
        if (!prevLog) {
          return { ...log.toJSON(), mileage: null };
        }
        const distance = log.odometer - prevLog.odometer;
        const mileage = distance / log.fuelAmount;
        return { ...log.toJSON(), mileage: parseFloat(mileage.toFixed(2)) };
      }
      return { ...log.toJSON(), mileage: null };
    });
  } catch (error: any) {
    console.error("Get Fuel Log : ", error);
    throw new FuelLogError(error.message, statusFromError(error));
  }
};

export const getFuelLogById = async (id: string) => {
  try {
    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) {
      throw new FuelLogError(
        `No Fuel Logs found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return fuelLog;
  } catch (error: any) {
    console.error("Get Fuel Log By Key: ", error);
    throw new FuelLogError(error.message, statusFromError(error));
  }
};

export const updateFuelLog = async (id: string, fuelLogData: any) => {
  try {
    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) {
      throw new FuelLogError(
        `No Fuel Logs found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }

    await fuelLog.update(fuelLogData);
    return { message: "Fuel log updated successfully." };
  } catch (error: any) {
    console.error("Update Fuel Log: ", error);
    throw new FuelLogError(error.message, statusFromError(error));
  }
};

export const deleteFuelLog = async (id: string) => {
  try {
    const result = await FuelLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new FuelLogError(
        `No Fuel Logs found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return { message: "Fuel log deleted successfully." };
  } catch (error: any) {
    console.error("Delete Fuel Log: ", error);
    throw new FuelLogError(error.message, statusFromError(error));
  }
};

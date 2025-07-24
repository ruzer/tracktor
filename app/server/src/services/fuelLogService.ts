import { FuelLogError, FuelLogNotFoundError } from "../exceptions/FuelLogError.js";
import { VehicleNotFoundError } from "../exceptions/VehicleErrors.js";
import {Vehicle, FuelLog} from "../models/index.js";

export const addFuelLog = async (vehicleId: string, fuelLogData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new VehicleNotFoundError("Vehicle not found.");
    }

    const fuelLog = await FuelLog.create({
      ...fuelLogData,
      vehicleId: parseInt(vehicleId),
    });
    return { id: fuelLog.id, message: "Fuel log added successfully." };
  } catch (error: any) {
    console.error("Error adding fuel log: ", error);
    if (error instanceof VehicleNotFoundError) {
      throw error;
    }
    throw new FuelLogError("Error adding fuel log.");
  }
};

export const getFuelLogs = async (vehicleId: string) => {
  try {
    const fuelLogs = await FuelLog.findAll({
      where: { vehicleId: parseInt(vehicleId) },
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
        const mileage = distance / log.fuelAmount; // km/L or miles/gallon
        return { ...log.toJSON(), mileage: parseFloat(mileage.toFixed(2)) };
      }
      return { ...log.toJSON(), mileage: null };
    });
  } catch (error: any) {
    console.error("Error fetching fuel logs: ", error);
    throw new FuelLogError("Error fetching fuel logs.");
  }
};

export const getFuelLogById = async (id: string) => {
  try {
    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) {
      throw new FuelLogNotFoundError();
    }
    return fuelLog;
  } catch (error: any) {
    console.error("Error fetching fuel log: ", error);
    if (error instanceof FuelLogNotFoundError) {
      throw error;
    }
    throw new FuelLogError("Error fetching fuel log.");
  }
};

export const updateFuelLog = async (id: string, fuelLogData: any) => {
  try {
    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) {
      throw new FuelLogNotFoundError();
    }

    await fuelLog.update(fuelLogData);
    return { message: "Fuel log updated successfully." };
  } catch (error: any) {
    console.error("Error updating fuel log: ", error);
    if (error instanceof FuelLogNotFoundError) {
      throw error;
    }
    throw new Error("Error updating fuel log.");
  }
};

export const deleteFuelLog = async (id: string) => {
  try {
    const result = await FuelLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new FuelLogNotFoundError();
    }
    return { message: "Fuel log deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting fuel log: ", error);
    if (error instanceof FuelLogNotFoundError) {
      throw error;
    }
    throw new Error("Error deleting fuel log.");
  }
};


import FuelLog from "../models/FuelLog.js";
import Vehicle from "../models/Vehicle.js";

export const addFuelLog = async (vehicleId: string, fuelLogData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const fuelLog = await FuelLog.create({
      ...fuelLogData,
      vehicleId: parseInt(vehicleId),
    });
    return { id: fuelLog.id, message: "Fuel log added successfully." };
  } catch (error: any) {
    throw new Error("Error adding fuel log.");
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
        const distance = log.odometer - prevLog.odometer;
        const mileage = distance / log.fuelAmount; // km/L or miles/gallon
        return { ...log.toJSON(), mileage: parseFloat(mileage.toFixed(2)) };
      }
      return { ...log.toJSON(), mileage: null };
    });
  } catch (error: any) {
    throw new Error("Error fetching fuel logs.");
  }
};

export const getFuelLogById = async (id: string) => {
  try {
    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) {
      throw new Error("Fuel log not found.");
    }
    return fuelLog;
  } catch (error: any) {
    throw new Error("Error fetching fuel log.");
  }
};

export const updateFuelLog = async (id: string, fuelLogData: any) => {
  try {
    const fuelLog = await FuelLog.findByPk(id);
    if (!fuelLog) {
      throw new Error("Fuel log not found.");
    }

    await fuelLog.update(fuelLogData);
    return { message: "Fuel log updated successfully." };
  } catch (error: any) {
    throw new Error("Error updating fuel log.");
  }
};

export const deleteFuelLog = async (id: string) => {
  try {
    const result = await FuelLog.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new Error("Fuel log not found.");
    }
    return { message: "Fuel log deleted successfully." };
  } catch (error: any) {
    throw new Error("Error deleting fuel log.");
  }
};

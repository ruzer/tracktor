import { VehicleExistsError, VehicleServiceError, VehicleNotFoundError } from "../exceptions/VehicleErrors.js";
import { Vehicle } from "../models/index.js";
import { UniqueConstraintError } from "sequelize";

export const addVehicle = async (vehicleData: any) => {
  try {
    const vehicle = await Vehicle.create(vehicleData);
    return { id: vehicle.id, message: "Vehicle added successfully." };
  } catch (error: unknown) {
    console.error("Error adding vehicle: ", error);
    if (error instanceof UniqueConstraintError) {
      throw new VehicleExistsError();
    }
    throw new VehicleServiceError("Error adding vehicle.");
  }
};

export const getAllVehicles = async () => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        { association: 'insurance' },
        { association: 'pollutionCertificate' }
      ]
    });

    return vehicles.map(vehicle => {
      const insurance = (vehicle as any).insurance;
      const pollutionCertificate = (vehicle as any).pollutionCertificate;

      let insuranceStatus = "N/A";
      if (insurance) {
        const endDate = new Date(insurance.endDate);
        insuranceStatus = endDate > new Date() ? "Active" : "Expired";
      }

      let puccStatus = "N/A";
      if (pollutionCertificate) {
        const expiryDate = new Date(pollutionCertificate.expiryDate);
        puccStatus = expiryDate > new Date() ? "Active" : "Expired";
      }

      return {
        ...vehicle.toJSON(),
        insuranceStatus,
        puccStatus
      };
    });
  } catch (error: unknown) {
    console.error("Error fetching vehicles: ", error);
    throw new VehicleServiceError("Error fetching vehicles.");
  }
};

export const getVehicleById = async (id: string) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }
    return vehicle;
  } catch (error: unknown) {
    console.error(`Error fetching vehicle(${id}):`, error);
    if (error instanceof VehicleNotFoundError) {
      throw error;
    }
    throw new VehicleServiceError("Error fetching vehicle.");
  }
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    await vehicle.update(vehicleData);
    return { message: "Vehicle updated successfully." };
  } catch (error: unknown) {
    console.error(`Error updating vehicle(${id}):`, error);
    if (error instanceof UniqueConstraintError) {
      throw new VehicleExistsError();
    }
    if (error instanceof VehicleNotFoundError) {
      throw error;
    }
    throw new VehicleServiceError("Error updating vehicle.");
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const result = await Vehicle.destroy({
      where: { id: id },
      cascade: true
    });
    if (result === 0) {
      throw new VehicleNotFoundError();
    }
    return { message: "Vehicle deleted successfully." };
  } catch (error: unknown) {
    console.error(`Error deleting vehicle(${id}):`, error);
    if (error instanceof VehicleNotFoundError) {
      throw error;
    }
    throw new VehicleServiceError("Error deleting vehicle.");
  }
};

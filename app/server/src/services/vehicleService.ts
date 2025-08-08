import {
  VehicleExistsError,
  VehicleServiceError,
  VehicleNotFoundError,
} from "../exceptions/VehicleErrors.js";
import { Insurance, PollutionCertificate, Vehicle } from "../models/index.js";
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
        { association: "insurance" },
        { association: "pollutionCertificate" },
      ],
    });

    // console.log(JSON.stringify(vehicles, null, 4));

    return vehicles.map((vehicle) => {
      const insurances: Insurance[] = (vehicle as any).insurance;
      const pollutionCertificates: PollutionCertificate[] = (vehicle as any)
        .pollutionCertificate;

      let insuranceStatus = "N/A";
      if (insurances && insurances.length > 0) {
        insuranceStatus = "Expired";
        insurances.forEach((insurance) => {
          const endDate = new Date(insurance.endDate);
          const today = new Date();
          if (endDate > today) {
            insuranceStatus = "Active";
          }
        });
      }

      let puccStatus = "N/A";
      if (pollutionCertificates && pollutionCertificates.length > 0) {
        puccStatus = "Expired";
        pollutionCertificates.forEach((pucc) => {
          const expiryDate = new Date(pucc.expiryDate);
          const today = new Date();
          if (expiryDate > today) {
            puccStatus = "Active";
          }
        });
      }

      return {
        ...vehicle.toJSON(),
        insuranceStatus,
        puccStatus,
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
      cascade: true,
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

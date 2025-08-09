import { Status, statusFromError } from "../exceptions/ServiceError.js";
import { VehicleError } from "../exceptions/VehicleError.js";
import { Insurance, PollutionCertificate, Vehicle } from "../models/index.js";

export const addVehicle = async (vehicleData: any) => {
  try {
    const vehicle = await Vehicle.create(vehicleData);
    return { id: vehicle.id, message: "Vehicle added successfully." };
  } catch (error: any) {
    console.error("Add vehicle: ", error);
    throw new VehicleError(error.message, statusFromError(error));
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
  } catch (error: any) {
    console.error("Get vehicles: ", error);
    throw new VehicleError(error.message, statusFromError(error));
  }
};

export const getVehicleById = async (id: string) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new VehicleError(
        `No vehicle found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return vehicle;
  } catch (error: any) {
    console.error(`Get vehicle:`, error);
    throw new VehicleError(error.message, statusFromError(error));
  }
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new VehicleError(
        `No vehicle found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }

    await vehicle.update(vehicleData);
    return { message: "Vehicle updated successfully." };
  } catch (error: any) {
    console.error(`Update vehicle:`, error);
    throw new VehicleError(error.message, statusFromError(error));
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const result = await Vehicle.destroy({
      where: { id: id },
      cascade: true,
    });
    if (result === 0) {
      throw new VehicleError(
        `No vehicle found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return { message: "Vehicle deleted successfully." };
  } catch (error: any) {
    console.error(`Delete vehicle:`, error);
    throw new VehicleError(error.message, statusFromError(error));
  }
};

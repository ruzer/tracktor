
import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (vehicleData: any) => {
  try {
    const vehicle = await Vehicle.create(vehicleData);
    return { id: vehicle.id, message: "Vehicle added successfully." };
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Vehicle with this license plate or VIN already exists.");
    }
    throw new Error("Error adding vehicle.");
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
      const insurance = vehicle.insurance;
      const pollutionCertificate = vehicle.pollutionCertificate;

      let insuranceStatus = "N/A";
      if (insurance) {
        const endDate = new Date(insurance.endDate);
        if (endDate > new Date()) {
          insuranceStatus = "Active";
        } else {
          insuranceStatus = "Expired";
        }
      }

      let puccStatus = "N/A";
      if (pollutionCertificate) {
        const expiryDate = new Date(pollutionCertificate.expiryDate);
        if (expiryDate > new Date()) {
          puccStatus = "Active";
        } else {
          puccStatus = "Expired";
        }
      }

      return {
        ...vehicle.toJSON(),
        insuranceStatus,
        puccStatus
      };
    });
  } catch (error: any) {
    throw new Error("Error fetching vehicles.");
  }
};

export const getVehicleById = async (id: string) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }
    return vehicle;
  } catch (error: any) {
    throw new Error("Error fetching vehicle.");
  }
};

export const updateVehicle = async (id: string, vehicleData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    await vehicle.update(vehicleData);
    return { message: "Vehicle updated successfully." };
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Vehicle with this license plate or VIN already exists.");
    }
    throw new Error("Error updating vehicle.");
  }
};

export const deleteVehicle = async (id: string) => {
  try {
    const result = await Vehicle.destroy({
      where: { id: id },
    });
    if (result === 0) {
      throw new Error("Vehicle not found.");
    }
    return { message: "Vehicle deleted successfully." };
  } catch (error: any) {
    throw new Error("Error deleting vehicle.");
  }
};

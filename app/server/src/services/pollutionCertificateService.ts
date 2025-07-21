
import PollutionCertificate from "../models/PollutionCertificate.js";
import Vehicle from "../models/Vehicle.js";

export const addPollutionCertificate = async (
  vehicleId: string,
  pollutionCertificateData: any
) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const pollutionCertificate = await PollutionCertificate.create({
      ...pollutionCertificateData,
      vehicleId: parseInt(vehicleId),
    });
    return {
      id: pollutionCertificate.id,
      message: "Pollution certificate added successfully.",
    };
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error(
        "Pollution certificate already exists for this vehicle or certificate number is not unique."
      );
    }
    throw new Error("Error adding pollution certificate.");
  }
};

export const getPollutionCertificate = async (vehicleId: string) => {
  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (!pollutionCertificate) {
      throw new Error("Pollution certificate not found.");
    }
    return pollutionCertificate;
  } catch (error: any) {
    throw new Error("Error fetching pollution certificate.");
  }
};

export const updatePollutionCertificate = async (
  vehicleId: string,
  pollutionCertificateData: any
) => {
  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (!pollutionCertificate) {
      throw new Error("Pollution certificate not found.");
    }

    await pollutionCertificate.update(pollutionCertificateData);
    return { message: "Pollution certificate updated successfully." };
  } catch (error: any) {
    throw new Error("Error updating pollution certificate.");
  }
};

export const deletePollutionCertificate = async (vehicleId: string) => {
  try {
    const result = await PollutionCertificate.destroy({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (result === 0) {
      throw new Error("Pollution certificate not found.");
    }
    return { message: "Pollution certificate deleted successfully." };
  } catch (error: any) {
    throw new Error("Error deleting pollution certificate.");
  }
};

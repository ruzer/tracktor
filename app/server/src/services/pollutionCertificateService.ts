import { Vehicle, PollutionCertificate } from "../models/index.js";
import { PollutionCertificateError } from "../exceptions/PollutionCertificateError.js";
import { UniqueConstraintError } from "sequelize";
import { Status, statusFromError } from "../exceptions/ServiceError.js";

export const addPollutionCertificate = async (
  vehicleId: string,
  pollutionCertificateData: any,
) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new PollutionCertificateError(
        `No vehicle found for id : ${vehicleId}`,
        Status.NOT_FOUND,
      );
    }
    const pollutionCertificate = await PollutionCertificate.create({
      ...pollutionCertificateData,
      vehicleId: vehicleId,
    });
    return {
      id: pollutionCertificate.id,
      message: "Pollution certificate added successfully.",
    };
  } catch (error: any) {
    console.error("Add PUCC: ", error);
    throw new PollutionCertificateError(error.message, statusFromError(error));
  }
};

export const getPollutionCertificates = async (vehicleId: string) => {
  try {
    const pollutionCertificates = await PollutionCertificate.findAll({
      where: { vehicleId: vehicleId },
    });
    if (!pollutionCertificates) {
      throw new PollutionCertificateError(
        `No PUCC found for vehicle id : ${vehicleId}`,
        Status.NOT_FOUND,
      );
    }
    return pollutionCertificates;
  } catch (error: any) {
    console.error("Get PUCCs: ", error);
    throw new PollutionCertificateError(error.message, statusFromError(error));
  }
};

export const updatePollutionCertificate = async (
  vehicleId: string,
  id: string,
  pollutionCertificateData: any,
) => {
  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: vehicleId, id: id },
    });
    if (!pollutionCertificate) {
      throw new PollutionCertificateError(
        `No PUCC found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }

    await pollutionCertificate.update(pollutionCertificateData);
    return { message: "Pollution certificate updated successfully." };
  } catch (error: any) {
    console.error("Update PUCC: ", error);
    throw new PollutionCertificateError(error.message, statusFromError(error));
  }
};

export const deletePollutionCertificate = async (id: string) => {
  try {
    const result = await PollutionCertificate.destroy({
      where: { id },
    });
    if (result === 0) {
      throw new PollutionCertificateError(
        `No PUCC found for id : ${id}`,
        Status.NOT_FOUND,
      );
    }
    return { message: "Pollution certificate deleted successfully." };
  } catch (error: any) {
    throw new PollutionCertificateError(error.message, statusFromError(error));
  }
};

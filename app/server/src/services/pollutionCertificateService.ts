import { Vehicle, PollutionCertificate } from "../models/index.js";
import {
  PollutionCertificateNotFoundError,
  PollutionCertificateExistsError,
  PollutionCertificateServiceError
} from "../exceptions/PollutionCertificateErrors.js";
import { UniqueConstraintError } from "sequelize";

export const addPollutionCertificate = async (
  vehicleId: string,
  pollutionCertificateData: any
) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new PollutionCertificateNotFoundError("Vehicle not found.");
    }

    const pollutionCertificate = await PollutionCertificate.create({
      ...pollutionCertificateData,
      vehicleId: vehicleId,
    });
    return {
      id: pollutionCertificate.id,
      message: "Pollution certificate added successfully.",
    };
  } catch (error: unknown) {
    if (error instanceof UniqueConstraintError) {
      throw new PollutionCertificateExistsError();
    }
    if (error instanceof PollutionCertificateNotFoundError) {
      throw error;
    }
    throw new PollutionCertificateServiceError("Error adding pollution certificate.");
  }
};

export const getPollutionCertificate = async (vehicleId: string) => {
  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: vehicleId },
    });
    if (!pollutionCertificate) {
      throw new PollutionCertificateNotFoundError();
    }
    return pollutionCertificate;
  } catch (error: unknown) {
    if (error instanceof PollutionCertificateNotFoundError) {
      throw error;
    }
    throw new PollutionCertificateServiceError("Error fetching pollution certificate.");
  }
};

export const updatePollutionCertificate = async (
  vehicleId: string,
  pollutionCertificateData: any
) => {
  try {
    const pollutionCertificate = await PollutionCertificate.findOne({
      where: { vehicleId: vehicleId },
    });
    if (!pollutionCertificate) {
      throw new PollutionCertificateNotFoundError();
    }

    await pollutionCertificate.update(pollutionCertificateData);
    return { message: "Pollution certificate updated successfully." };
  } catch (error: unknown) {
    if (error instanceof PollutionCertificateNotFoundError) {
      throw error;
    }
    throw new PollutionCertificateServiceError("Error updating pollution certificate.");
  }
};

export const deletePollutionCertificate = async (vehicleId: string) => {
  try {
    const result = await PollutionCertificate.destroy({
      where: { vehicleId: vehicleId },
    });
    if (result === 0) {
      throw new PollutionCertificateNotFoundError();
    }
    return { message: "Pollution certificate deleted successfully." };
  } catch (error: unknown) {
    if (error instanceof PollutionCertificateNotFoundError) {
      throw error;
    }
    throw new PollutionCertificateServiceError("Error deleting pollution certificate.");
  }
};

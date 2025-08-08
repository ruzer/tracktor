import {
  InsuranceNotFoundError,
  InsuranceExistsError,
  InsuranceServiceError,
} from "../exceptions/InsuranceError.js";
import { Insurance, Vehicle } from "../models/index.js";
import { UniqueConstraintError } from "sequelize";

export const addInsurance = async (vehicleId: string, insuranceData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new InsuranceNotFoundError("Vehicle not found.");
    }

    const insurance = await Insurance.create({
      ...insuranceData,
      vehicleId: vehicleId,
    });
    return {
      id: insurance.id,
      message: "Insurance details added successfully.",
    };
  } catch (error: unknown) {
    console.error("Error adding fuel log: ", error);
    if (error instanceof UniqueConstraintError) {
      throw new InsuranceExistsError();
    }
    if (error instanceof InsuranceNotFoundError) {
      throw error;
    }
    throw new InsuranceServiceError("Error adding insurance details.");
  }
};

export const getInsurances = async (vehicleId: string) => {
  try {
    const insurance = await Insurance.findAll({
      where: { vehicleId: vehicleId },
    });
    if (!insurance) {
      throw new InsuranceNotFoundError();
    }
    return insurance;
  } catch (error: unknown) {
    console.error("Error getting insurance: ", error);
    if (error instanceof InsuranceNotFoundError) {
      throw error;
    }
    throw new InsuranceServiceError("Error fetching insurance details.");
  }
};

export const updateInsurance = async (
  vehicleId: string,
  id: string,
  insuranceData: any,
) => {
  try {
    const insurance = await Insurance.findOne({
      where: { vehicleId: vehicleId, id },
    });
    if (!insurance) {
      throw new InsuranceNotFoundError();
    }

    await insurance.update(insuranceData);
    return { message: "Insurance details updated successfully." };
  } catch (error: unknown) {
    if (error instanceof InsuranceNotFoundError) {
      throw error;
    }
    throw new InsuranceServiceError("Error updating insurance details.");
  }
};

export const deleteInsurance = async (vehicleId: string) => {
  try {
    const result = await Insurance.destroy({
      where: { vehicleId: vehicleId },
    });
    if (result === 0) {
      throw new InsuranceNotFoundError();
    }
    return { message: "Insurance details deleted successfully." };
  } catch (error: unknown) {
    if (error instanceof InsuranceNotFoundError) {
      throw error;
    }
    throw new InsuranceServiceError("Error deleting insurance details.");
  }
};

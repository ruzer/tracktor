import { InsuranceError } from "../exceptions/InsuranceError.js";
import { Status, statusFromError } from "../exceptions/ServiceError.js";
import { Insurance, Vehicle } from "../models/index.js";
import { UniqueConstraintError } from "sequelize";

export const addInsurance = async (vehicleId: string, insuranceData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new InsuranceError(
        `No Vehicle found for id : ${vehicleId}`,
        Status.NOT_FOUND,
      );
    }
    const insurance = await Insurance.create({
      ...insuranceData,
      vehicleId: vehicleId,
    });
    return {
      id: insurance.id,
      message: "Insurance details added successfully.",
    };
  } catch (error: any) {
    console.error("Add Insurance: ", error);
    throw new InsuranceError(error.message, statusFromError(error));
  }
};

export const getInsurances = async (vehicleId: string) => {
  try {
    const insurance = await Insurance.findAll({
      where: { vehicleId: vehicleId },
    });
    if (!insurance) {
      throw new InsuranceError(
        `No Insurances found for vehicle id : ${vehicleId}`,
        Status.NOT_FOUND,
      );
    }
    return insurance;
  } catch (error: any) {
    console.error("Get Insurances: ", error);
    throw new InsuranceError(error.message, statusFromError(error));
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
      throw new InsuranceError(
        `No Insurances found for id: ${id}`,
        Status.NOT_FOUND,
      );
    }
    await insurance.update(insuranceData);
    return { message: "Insurance details updated successfully." };
  } catch (error: any) {
    console.error("Update Insurance: ", error);
    throw new InsuranceError(error.message, statusFromError(error));
  }
};

export const deleteInsurance = async (id: string) => {
  try {
    const result = await Insurance.destroy({
      where: { id },
    });
    if (result === 0) {
      throw new InsuranceError(
        `No Insurances found for id: ${id}`,
        Status.NOT_FOUND,
      );
    }
    return { message: "Insurance details deleted successfully." };
  } catch (error: any) {
    throw new InsuranceError(error.message, statusFromError(error));
  }
};

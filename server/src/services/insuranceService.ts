
import Insurance from "../models/Insurance.js";
import Vehicle from "../models/Vehicle.js";

export const addInsurance = async (vehicleId: string, insuranceData: any) => {
  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const insurance = await Insurance.create({
      ...insuranceData,
      vehicleId: parseInt(vehicleId),
    });
    return {
      id: insurance.id,
      message: "Insurance details added successfully.",
    };
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error("Insurance details already exist for this vehicle.");
    }
    throw new Error("Error adding insurance details.");
  }
};

export const getInsurance = async (vehicleId: string) => {
  try {
    const insurance = await Insurance.findOne({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (!insurance) {
      throw new Error("Insurance details not found.");
    }
    return insurance;
  } catch (error: any) {
    throw new Error("Error fetching insurance details.");
  }
};

export const updateInsurance = async (vehicleId: string, insuranceData: any) => {
  try {
    const insurance = await Insurance.findOne({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (!insurance) {
      throw new Error("Insurance details not found.");
    }

    await insurance.update(insuranceData);
    return { message: "Insurance details updated successfully." };
  } catch (error: any) {
    throw new Error("Error updating insurance details.");
  }
};

export const deleteInsurance = async (vehicleId: string) => {
  try {
    const result = await Insurance.destroy({
      where: { vehicleId: parseInt(vehicleId) },
    });
    if (result === 0) {
      throw new Error("Insurance details not found.");
    }
    return { message: "Insurance details deleted successfully." };
  } catch (error: any) {
    throw new Error("Error deleting insurance details.");
  }
};

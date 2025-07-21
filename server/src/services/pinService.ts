
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const setPin = async (pin: string) => {
  try {
    const hash = await bcrypt.hash(pin, 10);

    const [user, created] = await User.findOrCreate({
      where: { id: 1 },
      defaults: { hash: hash },
    });

    if (!created) {
      user.hash = hash;
      await user.save();
      return { status: 200, message: "PIN updated successfully." };
    } else {
      return { status: 201, message: "PIN set successfully." };
    }
  } catch (error: any) {
    throw new Error("Error hashing or setting PIN.");
  }
};

export const verifyPin = async (pin: string) => {
  try {
    const user = await User.findByPk(1);
    if (!user) {
      return {
        status: 404,
        message: "PIN not set. Please set a PIN first.",
      };
    }

    const match = await bcrypt.compare(pin, user.get("hash"));
    if (match) {
      return { status: 200, message: "PIN verified successfully." };
    } else {
      return { status: 401, message: "Invalid PIN." };
    }
  } catch (error: any) {
    throw new Error("Error verifying PIN.");
  }
};

export const getPinStatus = async () => {
  try {
    const user = await User.findByPk(1);
    return { exists: !!user };
  } catch (error: any) {
    throw new Error("Error checking PIN status.");
  }
};

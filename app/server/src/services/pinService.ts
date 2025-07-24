
import bcrypt from "bcrypt";
import {Auth} from "../models/index.js";
import { PinError } from "../exceptions/PinErrors.js";

export const setPin = async (pin: string) => {
  try {
    const hash = await bcrypt.hash(pin, 10);

    const [auth, created] = await Auth.findOrCreate({
      where: { id: 1 },
      defaults: { hash: hash },
    });

    if (!created) {
      auth.hash = hash;
      await auth.save();
      return { status: 200, message: "PIN updated successfully." };
    } else {
      return { status: 201, message: "PIN set successfully." };
    }
  } catch (error: any) {
    console.error("Error hashing or setting PIN:", error);
    throw new PinError("Error hashing or setting PIN.");
  }
};

export const verifyPin = async (pin: string) => {
  try {
    const auth = await Auth.findByPk(1);
    if (!auth) {
      return {
        status: 404,
        message: "PIN not set. Please set a PIN first.",
      };
    }

    const match = await bcrypt.compare(pin, auth.get("hash"));
    if (match) {
      return { status: 200, message: "PIN verified successfully." };
    } else {
      return { status: 401, message: "Invalid PIN." };
    }
  } catch (error: any) {
    console.error("Error verifying PIN:", error);
    throw new PinError("Error while verifying PIN.");
  }
};

export const getPinStatus = async () => {
  try {
    const auth = await Auth.findByPk(1);
    return { exists: !!auth };
  } catch (error: any) {
    console.error("Error checking PIN status:", error);
    throw new PinError("Error checking PIN status.");
  }
};

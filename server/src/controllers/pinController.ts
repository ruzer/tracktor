
import { Request, Response } from "express";
import * as pinService from "../services/pinService.js";

export const setPin = async (req: Request, res: Response) => {
  const { pin } = req.body;

  if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ message: "PIN must be a 6-digit number." });
  }

  try {
    const result = await pinService.setPin(pin);
    res.status(result.status).json({ message: result.message });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPin = async (req: Request, res: Response) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ message: "PIN is required." });
  }

  try {
    const result = await pinService.verifyPin(pin);
    res.status(result.status).json({ message: result.message });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPinStatus = async (req: Request, res: Response) => {
  try {
    const result = await pinService.getPinStatus();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

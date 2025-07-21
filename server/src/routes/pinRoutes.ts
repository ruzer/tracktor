import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

router.post("/pin", async (req, res) => {
  const { pin } = req.body;

  if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ message: "PIN must be a 6-digit number." });
  }

  try {
    const hash = await bcrypt.hash(pin, 10);

    const [user, created] = await User.findOrCreate({
      where: { id: 1 },
      defaults: { hash: hash },
    });

    if (!created) {
      user.hash = hash;
      await user.save();
      res.status(200).json({ message: "PIN updated successfully." });
    } else {
      res.status(201).json({ message: "PIN set successfully." });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error hashing or setting PIN.", error: error.message });
  }
});

router.post("/pin/verify", async (req, res) => {
  const { pin } = req.body;

  if (!pin) {
    return res.status(400).json({ message: "PIN is required." });
  }

  try {
    const user = await User.findByPk(1);
    if (!user) {
      return res
        .status(404)
        .json({ message: "PIN not set. Please set a PIN first." });
    }

    const match = await bcrypt.compare(pin, user.get("hash"));
    if (match) {
      res.status(200).json({ message: "PIN verified successfully." });
    } else {
      res.status(401).json({ message: "Invalid PIN." });
    }
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error verifying PIN.", error: error.message });
  }
});

router.get("/pin/status", async (req, res) => {
  try {
    const user = await User.findByPk(1);
    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error checking PIN status.", error: error.message });
  }
});

export default router;

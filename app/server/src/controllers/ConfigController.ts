import { Request, Response } from "express";
import {
  getAppConfig,
  getAppConfigByKey,
  updateAppConfig,
} from "../services/configService.js";

export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await getAppConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Error fetching configuration" });
  }
};

export const getConfigByKey = async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    if (!key) {
      return res.status(400).json({ message: "Key parameter is required" });
    }
    const config = await getAppConfigByKey(key);
    if (!config) {
      return res.status(404).json({ message: "Configuration not found" });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Error fetching configuration" });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const configs: { key: string; value: string }[] = req.body;
    if (!Array.isArray(configs) || configs.length === 0) {
      return res.status(400).json({ message: "Invalid configuration data" });
    }
    const updatedConfigs = await Promise.all(
      configs.map(async (config) => {
        const { key, value } = config;
        if (!key || value === undefined) {
          throw new Error("Key and value are required for each configuration");
        }
        return await updateAppConfig(key, value);
      }),
    );
    res.json(updatedConfigs);
  } catch (error) {
    res.status(500).json({ message: "Error updating configuration" });
  }
};

import { Request, Response } from "express";
import {
  getAppConfig,
  getAppConfigByKey,
  updateAppConfig,
} from "../services/configService.js";
import { ConfigError } from "../exceptions/ConfigError.js";
import { Status } from "../exceptions/ServiceError.js";

export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await getAppConfig();
    res.status(200).json(config);
  } catch (error: any) {
    res.status(error.status.valueOf).json({ message: error.message });
  }
};

export const getConfigByKey = async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    if (!key) {
      throw new ConfigError("Key parameter is required", Status.BAD_REQUEST);
    }
    const config = await getAppConfigByKey(key);
    res.status(200).json(config);
  } catch (error: any) {
    res.status(error.status.valueOf).json({ message: error.message });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const configs: { key: string; value: string }[] = req.body;
    if (!Array.isArray(configs) || configs.length === 0) {
      throw new ConfigError("Invalid configuration data", Status.BAD_REQUEST);
    }
    const updatedConfigs = await Promise.all(
      configs.map(async (config) => {
        const { key, value } = config;
        return await updateAppConfig(key, value);
      }),
    );
    res.json(updatedConfigs);
  } catch (error: any) {
    res.status(error.status.valueOf).json({ message: error.message });
  }
};

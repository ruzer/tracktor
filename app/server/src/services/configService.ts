import { ConfigError } from "../exceptions/ConfigError.js";
import { Status, statusFromError } from "../exceptions/ServiceError.js";
import Config from "../models/Config.js";

export const getAppConfig = async () => {
  try {
    let config = await Config.findAll({
      attributes: ["key", "value", "description"],
    });
    if (!config) {
      config = [];
    }
    return config;
  } catch (error: any) {
    console.error("Get Config : ", error);
    throw new ConfigError(error.message, statusFromError(error));
  }
};

export const getAppConfigByKey = async (key: string) => {
  try {
    const config = await Config.findOne({ where: { key } });
    if (!config) {
      throw new ConfigError(
        `No config found for key : ${key}`,
        Status.NOT_FOUND,
      );
    }
    return config;
  } catch (error: any) {
    console.error("Get Config By Key : ", error);
    throw new ConfigError(error.messge, statusFromError(error));
  }
};

export const updateAppConfig = async (key: string, value: string) => {
  try {
    if (!key || value === undefined) {
      throw new ConfigError(
        "Key and value are required for each configuration",
        Status.BAD_REQUEST,
      );
    }
    const config = await getAppConfigByKey(key);
    if (!config) {
      return await Config.create({ key, value });
    }
    config.value = value;
    await config.save();
    return config;
  } catch (error: any) {
    console.error("Update Config : ", error);
    throw new ConfigError(error.message, statusFromError(error));
  }
};

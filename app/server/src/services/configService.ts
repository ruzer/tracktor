import Config from "../models/Config.js";

export const getAppConfig = async () => {
  let config = await Config.findAll({
    attributes: ["key", "value", "description"],
  });
  if (!config) {
    config = [];
  }
  return config;
};

export const getAppConfigByKey = async (key: string) => {
  const config = await Config.findOne({ where: { key } });
  return config;
};

export const updateAppConfig = async (key: string, value: string) => {
  const config = await getAppConfigByKey(key);
  if (!config) {
    return await Config.create({ key, value });
  }
  config.value = value;
  await config.save();
  return config;
};

import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string,
  currentUserName: string,
};
export function getConfigFilePath(): string {   // Get the path to the configuration file in the user's home directory
  return path.join(os.homedir(), ".gatorconfig.json");

}
export function validateConfig(rawConfig: any):Config{ // Validate the configuration object
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid dbUrl in config file");
  }
  if (typeof rawConfig.current_user_name !== "string") {
    throw new Error("Invalid currentUserName in config file");
  }
  return {dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name};

}
export function readConfig() : Config { // Read the configuration file
  const file = getConfigFilePath();
  if (!fs.existsSync(file)) {
    throw new Error('Config file not found');
    };
  const fileContent = fs.readFileSync(file, 'utf-8');
  return validateConfig(JSON.parse(fileContent));
}
export function writeConfig(cfg: Config): void { // Write the configuration object
  const file = getConfigFilePath();
  const rawConfig = {db_url: cfg.dbUrl,current_user_name: cfg.currentUserName};
  fs.writeFileSync(file, JSON.stringify(rawConfig, null, 2), 'utf-8');
}
export function setUser(current_user_name: string) : void { // Set the current user in the configuration file
  const cfg = readConfig();
  cfg.currentUserName = current_user_name;
  writeConfig(cfg);
}
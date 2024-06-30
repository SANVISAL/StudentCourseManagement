import dotenv from "dotenv";
import path from "path";
function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  const requirementconfig = ["PORT", "MONGODB_URL"];
  const missingConfig = requirementconfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing config environment variables: ${missingConfig.join(", ")}`
    );
  }
  return {
    port: process.env.PORT,
    mongourl: process.env.MONGODB_URL,
  };
}

const getConfig = (currentEnv: string = "development") => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};


export default getConfig;
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface Config {
  port: number
  debugLogging: boolean
  dbsslconn: boolean
  jwtSecret: string
  databaseUrl: string
  dbEntitiesPath: string[]
  cronJobExpression: string
}

const isDevMode = process.env.NODE_ENV == "development";

const config: Config = {
  port: +(process.env.PORT || 8080),
  debugLogging: isDevMode,
  dbsslconn: true,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  dbEntitiesPath: ["src/entity/**/*.ts"],
  cronJobExpression: "0 * * * *",
};

export { config };

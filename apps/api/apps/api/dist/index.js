// src/config.ts
import { config as dotEnvConfig } from "dotenv";
var nodeEnvs = ["development", "test", "production", "prod"];
var instantiatedDotEnv;
var config_;
var getValidValue = (value, allowedValues) => {
  if (allowedValues.includes(value)) {
    return value;
  }
  throw new Error(`Invalid value: ${value}. Allowed values: ${allowedValues.join(", ")}`);
};
var setupConfig = () => {
  if (!instantiatedDotEnv) {
    instantiatedDotEnv = dotEnvConfig();
  }
  config_ = config_ || {
    nodeEnv: getValidValue(process.env.NODE_ENV || "development", nodeEnvs),
    // Database configuration
    postgresHost: process.env.POSTGRES_HOST || "127.0.0.1",
    postgresPort: Number(process.env.POSTGRES_PORT || 5432),
    postgresUser: process.env.POSTGRES_USER || "postgres",
    postgresPassword: process.env.POSTGRES_PASSWORD || "",
    postgresDatabase: process.env.POSTGRES_DB || "network",
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    jwtExpiresIn: "30d",
    // 30 days sliding scale
    // CORS configuration
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080",
    // Server configuration
    serverPort: Number(process.env.PORT || 3e3),
    // AWS configuration
    awsRegion: process.env.AWS_REGION || "us-east-1",
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    // Email configuration
    fromEmail: process.env.FROM_EMAIL || "noreply@yourdomain.com",
    // SMS configuration
    smsFromNumber: process.env.SMS_FROM_NUMBER || "+1234567890",
    // Voice configuration
    connectInstanceId: process.env.CONNECT_INSTANCE_ID || "",
    connectContactFlowId: process.env.CONNECT_CONTACT_FLOW_ID || ""
  };
  return config_;
};
var config = setupConfig();

// src/container.ts
import { Enums, enumRegistry } from "@network/contracts";
import { asFunction, asValue, createContainer } from "awilix";
import { initializeSmartEnumMappings } from "smart-enums";

// src/knex.ts
import knex from "knex";

// src/knexfile.ts
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname2, "../.env") });
var ROOT = path.resolve(__dirname2, "..");
var MIGRATIONS_DIR = path.join(ROOT, "db/migrations");
var SEEDS_DIR = path.join(ROOT, "db/seeds");
var connection = {
  host: config.postgresHost,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDatabase
};
var convertNullsToUndefined = (obj) => {
  if (obj === null) return void 0;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(convertNullsToUndefined);
  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertNullsToUndefined(value)])
    );
  }
  return obj;
};
var knexConfig = {
  client: "pg",
  connection,
  postProcessResponse: (result) => convertNullsToUndefined(result),
  migrations: {
    directory: MIGRATIONS_DIR,
    tableName: "knex_migrations",
    extension: "ts"
  },
  seeds: {
    directory: SEEDS_DIR,
    extension: "ts"
  }
};

// src/knex.ts
var database = knex(knexConfig);
process.on("SIGINT", async () => {
  await database.destroy();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await database.destroy();
  process.exit(0);
});

// src/container.ts
var container = createContainer({
  injectionMode: "PROXY"
});
container.register({
  connection: asValue(database)
});
container.register({
  Enums: asValue(Enums),
  // Register the full Enums object for reviveSmartEnums
  enumRegistry: asValue(enumRegistry),
  // Register the properly typed enum registry
  ...Object.fromEntries(Object.entries(Enums).map(([key, value]) => [key, asValue(value)]))
});
container.loadModules(
  [
    "services/**/*.@(ts|js)",
    "repositories/**/*.@(ts|js)",
    "controllers/**/*.@(ts|js)",
    "middleware/**/*.@(ts|js)",
    "routes/**/*.@(ts|js)",
    "koaServer.@(ts|js)"
  ],
  {
    cwd: __dirname,
    resolverOptions: {
      register: asFunction
    },
    // Configure naming strategy to remove 'create' prefix
    formatName: (name) => {
      if (name.startsWith("create")) {
        return name.substring(6).charAt(0).toLowerCase() + name.substring(7);
      }
      return name;
    }
  }
);
initializeSmartEnumMappings({ enumRegistry });

// src/index.ts
var server = container.resolve("koaServer");
server.listen(config.serverPort, () => {
  console.log(`\u{1F680} Server running on http://localhost:${config.serverPort}`);
});

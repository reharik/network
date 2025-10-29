var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/config.ts
import { config as dotEnvConfig } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path.dirname(__filename);
var nodeEnvs = ["development", "test", "production", "prod"];
var config_;
var instantiatedDotEnv;
var getValidValue = (value, allowedValues) => {
  if (allowedValues.includes(value)) {
    return value;
  }
  throw new Error(`Invalid value: ${value}. Allowed values: ${allowedValues.join(", ")}`);
};
var setupConfig = () => {
  if (!instantiatedDotEnv) {
    instantiatedDotEnv = dotEnvConfig({
      path: path.resolve(__dirname2, "../.env"),
      override: false
    });
  }
  const nodeEnv = getValidValue(process.env.NODE_ENV || "development", nodeEnvs);
  const isProduction = nodeEnv === "production" || nodeEnv === "prod";
  if (isProduction) {
    if (process.env.AWS_ENDPOINT) {
      console.warn(
        "\u26A0\uFE0F  WARNING: AWS_ENDPOINT is set in production! This will route AWS requests to LocalStack instead of real AWS services."
      );
    }
    if (process.env.JWT_SECRET === "your-secret-key-change-in-production") {
      console.warn("\u26A0\uFE0F  WARNING: Using default JWT secret in production! This is a security risk.");
    }
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn(
        "\u26A0\uFE0F  WARNING: AWS credentials not configured. Communication services will fail."
      );
    }
  }
  config_ = {
    nodeEnv,
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
    awsEndpoint: process.env.AWS_ENDPOINT,
    // Optional LocalStack endpoint
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

// ../../packages/enumerations/dist/src/enums/index.js
var enums_exports = {};
__export(enums_exports, {
  ContactMethod: () => ContactMethod,
  Validator: () => Validator
});

// ../../packages/enumerations/dist/src/enums/ContactMethod.js
import { enumeration } from "smart-enums";
var input = {
  email: {
    link: (contactable) => `mailto:${contactable.email}`,
    handle: (contactable) => contactable.email
  },
  sms: {
    link: (contactable) => `sms:${contactable.sms}`,
    handle: (contactable) => contactable.sms
  },
  call: {
    link: (contactable) => `tel:${contactable.call}`,
    handle: (contactable) => contactable.call
  },
  other: { link: () => "#", handle: () => "" }
};
var ContactMethod = enumeration("ContactMethod", {
  input
});

// ../../packages/enumerations/dist/src/enums/Validator.js
import { validateContact, validateInsertContact, validateInsertTouch, validateInsertUser, validateTouch, validateUpdateContact, validateUpdateUser, validateUser } from "@network/validators";
import { enumeration as enumeration2 } from "smart-enums";
var input2 = {
  contact: { validate: validateContact },
  insertContact: { validate: validateInsertContact },
  updateContact: { validate: validateUpdateContact },
  touch: { validate: validateTouch },
  insertTouch: { validate: validateInsertTouch },
  user: { validate: validateUser },
  insertUser: { validate: validateInsertUser },
  updateUser: { validate: validateUpdateUser }
};
var Validator = enumeration2("Validator", {
  input: input2
});

// ../../packages/enumerations/dist/src/enumRegistry.js
import { isSmartEnumItem } from "smart-enums";
var enumRegistry = Object.entries(enums_exports).reduce((acc, [key, value]) => {
  if (isSmartEnumItem(value)) {
    acc[key] = value;
  }
  return acc;
}, {});

// src/container.ts
import { asFunction, asValue, createContainer } from "awilix";
import { initializeSmartEnumMappings } from "smart-enums";

// src/knex.ts
import knex from "knex";

// src/knexfile.ts
import dotenv from "dotenv";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname3 = path2.dirname(__filename2);
dotenv.config({ path: path2.resolve(__dirname3, "../.env") });
var ROOT = path2.resolve(__dirname3, "..");
var MIGRATIONS_DIR = path2.join(ROOT, "db/migrations");
var SEEDS_DIR = path2.join(ROOT, "db/seeds");
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
  Enums: asValue(enums_exports),
  // Register the full Enums object for reviveSmartEnums
  enumRegistry: asValue(enumRegistry),
  // Register the properly typed enum registry
  ...Object.fromEntries(Object.entries(enums_exports).map(([key, value]) => [key, asValue(value)]))
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

// apps/api/src/container.ts
import { Enums, createSmartEnumJSONReviver } from "@network/contracts";
import { asFunction, asValue, createContainer } from "awilix";

// apps/api/src/knex.ts
import knex from "knex";

// apps/api/src/knexfile.ts
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
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || "postgres",
  password: String(process.env.POSTGRES_PASSWORD || ""),
  database: process.env.POSTGRES_DB || "network"
};
var knexConfig = {
  client: "pg",
  connection,
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

// apps/api/src/knex.ts
var database = knex(knexConfig);
process.on("SIGINT", async () => {
  await database.destroy();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await database.destroy();
  process.exit(0);
});

// apps/api/src/container.ts
var container = createContainer({
  injectionMode: "PROXY"
});
container.register({
  connection: asValue(database)
});
container.register({
  smartEnumReviver: asFunction(createSmartEnumJSONReviver)
});
container.register({
  Enums: asValue(Enums),
  // Register the full Enums object for createSmartEnumJSONReviver
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

// apps/api/src/index.ts
var PORT = process.env.PORT || 3e3;
var server = container.resolve("koaServer");
server.listen(PORT, () => {
  console.log(`\u{1F680} Server running on http://localhost:${PORT}`);
});

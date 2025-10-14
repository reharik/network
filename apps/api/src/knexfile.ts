import dotenv from 'dotenv';
import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ROOT = path.resolve(__dirname, '..');
const MIGRATIONS_DIR = path.join(ROOT, 'db/migrations');
const SEEDS_DIR = path.join(ROOT, 'db/seeds');
const connection: Knex.StaticConnectionConfig = {
  host: config.postgresHost,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDatabase,
};

// Convert null values to undefined in query results while preserving Date objects
const convertNullsToUndefined = (obj: unknown): unknown => {
  if (obj === null) return undefined;
  if (obj instanceof Date) return obj; // Preserve Date objects
  if (Array.isArray(obj)) return obj.map(convertNullsToUndefined);
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertNullsToUndefined(value)]),
    );
  }
  return obj;
};

export const knexConfig = {
  client: 'pg',
  connection,
  postProcessResponse: (result: unknown) => convertNullsToUndefined(result),
  migrations: {
    directory: MIGRATIONS_DIR,
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  seeds: {
    directory: SEEDS_DIR,
    extension: 'ts',
  },
} satisfies Knex.Config;

export default knexConfig;

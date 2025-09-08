import dotenv from 'dotenv';
import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ROOT = path.resolve(__dirname, '..');
const MIGRATIONS_DIR = path.join(ROOT, 'db/migrations');
const SEEDS_DIR = path.join(ROOT, 'db/seeds');

const connection: Knex.StaticConnectionConfig = {
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || 'postgres',
  password: String(process.env.POSTGRES_PASSWORD || ''),
  database: process.env.POSTGRES_DB || 'network',
};

export const knexConfig = {
  client: 'pg',
  connection,
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

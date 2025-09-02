// app/src/knex.ts
import knexPkg from 'knex';
import { knexConfig } from './knexfile';

export const db = knexPkg.knex(knexConfig);

// optional: graceful shutdown hooks
process.on('SIGINT', async () => {
  await db.destroy();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await db.destroy();
  process.exit(0);
});

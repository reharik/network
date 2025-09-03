import knex, { type Knex } from 'knex';
import { knexConfig } from './knexfile';

export const db: Knex = knex.knex(knexConfig);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  await db.destroy();
  process.exit(0);
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', async () => {
  await db.destroy();
  process.exit(0);
});

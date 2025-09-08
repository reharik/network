import knex, { type Knex } from 'knex';
import { knexConfig } from './knexfile';

export const database: Knex = knex.knex(knexConfig);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', async () => {
  await database.destroy();
  process.exit(0);
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', async () => {
  await database.destroy();
  process.exit(0);
});

import type { Knex } from 'knex';

export const getUser = (db: Knex, id: string) =>
  db('users').where({ id }).first();

export const updateDailyGoal = async (
  db: Knex,
  id: string,
  dailyGoal: number,
) => {
  const [row] = await db('users').where({ id }).update({ dailyGoal }, '*');
  return row;
};

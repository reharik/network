import type { Knex } from 'knex';
import type { User } from '@network/contracts';

export interface UserRepository {
  getUser: (id: string) => Promise<User | undefined>;
  updateDailyGoal: (id: string, dailyGoal: number) => Promise<User | undefined>;
}

export const createUserRepository = ({
  connection,
}: {
  connection: Knex;
}): UserRepository => ({
  getUser: async (id: string) => {
    const result = await connection<User>('users').where({ id }).first();
    return result;
  },
  updateDailyGoal: async (id: string, dailyGoal: number) => {
    const [row] = await connection('users')
      .where({ id })
      .update({ dailyGoal }, '*');
    return row;
  },
});

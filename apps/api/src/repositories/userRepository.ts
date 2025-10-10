import type { User } from '@network/contracts';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

export interface UserRepository {
  getUser: (id: string) => Promise<User | undefined>;
  updateDailyGoal: (id: string, dailyGoal: number) => Promise<User | undefined>;
}

export const createUserRepository = ({ connection }: Container): UserRepository => ({
  getUser: async (id: string) => {
    return connection<User>('users').where({ id }).first();
  },
  updateDailyGoal: async (id: string, dailyGoal: number) => {
    const result = await connection<User>('users')
      .where({ id })
      .update({ dailyGoal })
      .returning('*');
    return result ? result[0] : undefined;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createUserRepository as any)[RESOLVER] = {};

import type { User } from '@network/contracts';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

export interface UserRepository {
  getUser: (id: string) => Promise<User | undefined>;
  getUserByEmail: (email: string) => Promise<User | undefined>;
  createUser: (data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<User>;
  updateDailyGoal: (id: string, dailyGoal: number) => Promise<User | undefined>;
  updateProfile: (
    id: string,
    updates: { firstName?: string; lastName?: string; email?: string; phone?: string },
  ) => Promise<User | undefined>;
}

export const createUserRepository = ({ connection }: Container): UserRepository => ({
  getUser: async (id: string) => {
    return connection<User>('users').where({ id }).first();
  },
  getUserByEmail: async (email: string) => {
    return connection<User>('users').where({ email }).first();
  },
  createUser: async (data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const [user] = await connection<User>('users')
      .insert({
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        dailyGoal: 3, // Default daily goal
        lastLoginAt: new Date().toISOString(),
      })
      .returning('*');
    return user;
  },
  updateDailyGoal: async (id: string, dailyGoal: number) => {
    const result = await connection<User>('users')
      .where({ id })
      .update({ dailyGoal })
      .returning('*');
    return result ? result[0] : undefined;
  },
  updateProfile: async (
    id: string,
    updates: { firstName?: string; lastName?: string; email?: string; phone?: string },
  ) => {
    const result = await connection<User>('users').where({ id }).update(updates).returning('*');
    return result ? result[0] : undefined;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createUserRepository as any)[RESOLVER] = {};

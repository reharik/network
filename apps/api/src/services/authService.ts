import { User } from '@network/contracts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Knex } from 'knex';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<{ user: User; token: string } | null>;
  verifyToken: (token: string) => Promise<User | null>;
  hashPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, hash: string) => Promise<boolean>;
}

export const createAuthService = ({ connection }: { connection: Knex }): AuthService => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const JWT_EXPIRES_IN = '30d'; // 30 days sliding scale

  return {
    login: async (credentials: LoginCredentials) => {
      const { email, password } = credentials;

      // Find user by email
      const user = await connection('users').where({ email }).first();
      console.log(`************user************`);
      console.log(JSON.stringify(user, null, 4));
      console.log(`********END user************`);
      if (!user || !user.passwordHash) {
        return null;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      console.log(`************isValidPassword************`);
      console.log(isValidPassword);
      console.log(`********END isValidPassword************`);
      if (!isValidPassword) {
        return null;
      }

      // Update last login
      await connection('users')
        .where({ id: user.id })
        .update({ lastLoginAt: new Date().toISOString() });

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      return { user, token };
    },

    verifyToken: async (token: string) => {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        const user = await connection('users').where({ id: decoded.userId }).first();

        if (!user) {
          return null;
        }

        return user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        return null;
      }
    },

    hashPassword: async (password: string) => {
      return bcrypt.hash(password, 12);
    },

    comparePassword: async (password: string, hash: string) => {
      return bcrypt.compare(password, hash);
    },
  };
};

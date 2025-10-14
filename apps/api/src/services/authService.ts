import { User } from '@network/contracts';
import { RESOLVER } from 'awilix';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { Container } from '../container';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<{ user: User; token: string } | undefined>;
  verifyToken: (token: string) => Promise<User | undefined>;
  hashPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, hash: string) => Promise<boolean>;
}

export const createAuthService = ({ connection }: Container): AuthService => {
  return {
    login: async (credentials: LoginCredentials) => {
      const { email, password } = credentials;

      // Find user by email
      const user = await connection('users').where({ email }).first();
      if (!user || !user.passwordHash) {
        return undefined;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return undefined;
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
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
      );

      return { user, token };
    },

    verifyToken: async (token: string) => {
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as {
          userId: string;
          email: string;
        };

        const user = await connection('users').where({ id: decoded.userId }).first();

        if (!user) {
          return undefined;
        }

        return user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        return undefined;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createAuthService as any)[RESOLVER] = {};

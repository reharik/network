import { RESOLVER } from 'awilix';
import type { Context, Next } from 'koa';
import type { Container } from '../container';

export type AuthMiddleware = (ctx: Context, next: Next) => Promise<void>;
export type OptionalAuthMiddleware = AuthMiddleware;

export const createAuthMiddleware = ({ authService }: Container) => {
  return async (ctx: Context, next: Next) => {
    const authHeader = ctx.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: 'Authorization header required' };
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await authService.verifyToken(token);

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid or expired token' };
      return;
    }

    // Add user directly on context for easy access
    ctx.user = user;
    await next();
  };
};

export const createOptionalAuthMiddleware = ({ authService }: Container) => {
  return async (ctx: Context, next: Next) => {
    const authHeader = ctx.get('Authorization');
    ctx.isLoggedIn = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await authService.verifyToken(token);

      if (user) {
        ctx.user = user;
        ctx.isLoggedIn = true;
      }
    }

    await next();
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createAuthMiddleware as any)[RESOLVER] = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createOptionalAuthMiddleware as any)[RESOLVER] = {};

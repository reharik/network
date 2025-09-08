import type { Context, Next } from 'koa';
import type { AuthService } from '../services/authService';

export const createAuthMiddleware = ({ authService }: { authService: AuthService }) => {
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

export const createOptionalAuthMiddleware = ({ authService }: { authService: AuthService }) => {
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
// Test comment Mon Sep  8 02:32:06 PM CDT 2025

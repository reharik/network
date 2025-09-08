import type { Context, Next } from 'koa';
import type { AuthService } from '../services/authService';

export interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    dailyGoal: number;
  };
}

export const createAuthMiddleware = (authService: AuthService) => {
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

// Optional auth middleware - doesn't fail if no token
export const createOptionalAuthMiddleware = (authService: AuthService) => {
  return async (ctx: Context, next: Next) => {
    const authHeader = ctx.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await authService.verifyToken(token);

      if (user) {
        ctx.user = user;
      }
    }

    await next();
  };
};

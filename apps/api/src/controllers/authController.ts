import { RESOLVER } from 'awilix';
import type { Context } from 'koa';
import type { Container } from '../container';

export interface AuthController {
  login: (ctx: Context) => Promise<Context>;
  logout: (ctx: Context) => Context;
  me: (ctx: Context) => Context;
}

export const createAuthController = ({ authService }: Container): AuthController => ({
  login: async (ctx: Context): Promise<Context> => {
    const { email, password } = ctx.request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      ctx.status = 400;
      ctx.body = { error: 'Email and password are required' };
      return ctx;
    }

    const result = await authService.login({ email, password });
    if (!result) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid email or password' };
      return ctx;
    }

    ctx.status = 200;
    ctx.body = {
      user: result.user,
      token: result.token,
    };
    return ctx;
  },

  logout: (ctx: Context): Context => {
    // Since we're using JWT, logout is handled client-side by removing the token
    // In a more sophisticated setup, you might want to maintain a token blacklist
    ctx.status = 200;
    ctx.body = { message: 'Logged out successfully' };
    return ctx;
  },

  me: (ctx: Context): Context => {
    // This endpoint requires authentication middleware
    const user = ctx.user;

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Not authenticated' };
      return ctx;
    }

    ctx.status = 200;
    ctx.body = { user };
    return ctx;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createAuthController as any)[RESOLVER] = {};

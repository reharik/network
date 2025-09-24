import { RESOLVER } from 'awilix';
import { Context } from 'koa';
import type { Container } from '../container';

export interface UserController {
  getMe: (ctx: Context) => Promise<Context>;
  updateDailyGoal: (ctx: Context) => Promise<Context>;
}

export const createUserController = ({ userRepository }: Container): UserController => ({
  getMe: async (ctx: Context): Promise<Context> => {
    const user = await userRepository.getUser(ctx.user.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return ctx;
    }
    ctx.body = user;
    return ctx;
  },
  updateDailyGoal: async (ctx: Context): Promise<Context> => {
    const { dailyGoal } = ctx.request.body as { dailyGoal: number };
    const user = await userRepository.updateDailyGoal(ctx.user.id, dailyGoal);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return ctx;
    }
    ctx.body = user;
    return ctx;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createUserController as any)[RESOLVER] = {};

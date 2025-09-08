import { Context } from 'koa';
import type { UserRepository } from '../repositories/userRepository';


export interface UserController {
  getMe: (ctx: Context) => Promise<Context>;
  updateDailyGoal: (ctx: Context) => Promise<Context>;
}

export const createUserController = ({
  userRepository,
}: {
  userRepository: UserRepository;
}): UserController => ({
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
    const user = await userRepository.updateDailyGoal(
      ctx.user.id,
      dailyGoal,
    );
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return ctx;
    }
    ctx.body = user;
    return ctx;
  },
});

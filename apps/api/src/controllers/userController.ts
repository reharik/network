import { Context } from 'koa';
import { upsertDailyGoalSchema } from '@network/contracts';
import type { UserRepository } from '../repositories/userRepository';

type StateUser = { id: string };

export interface UserController {
  getMe: (ctx: Context) => Promise<Context>;
  updateDailyGoal: (ctx: Context) => Promise<Context>;
}

export const createUserController = (
  userRepository: UserRepository,
): UserController => ({
  getMe: async (ctx: Context): Promise<Context> => {
    const userId = (ctx.state.user as StateUser).id;
    const user = await userRepository.getUser(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return ctx;
    }
    ctx.status = 200;
    ctx.body = user;
    return ctx;
  },

  updateDailyGoal: async (ctx: Context): Promise<Context> => {
    const val = upsertDailyGoalSchema.safeParse(ctx.request.body);
    if (!val.success) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid request format', issues: val.error.issues };
      return ctx;
    }

    const userId = (ctx.state.user as StateUser).id;
    const updated = await userRepository.updateDailyGoal(
      userId,
      val.data.dailyGoal,
    );
    if (!updated) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return ctx;
    }

    ctx.status = 200;
    ctx.body = updated;
    return ctx;
  },
});

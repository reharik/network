import { Context } from 'koa';
import {
  getUser as repoGetUser,
  updateDailyGoal as repoUpdateDaily,
} from '../repositories/userRepository';
import { updateDailyGoalBodySchema } from './requestSchemas';

type StateUser = { id: string };

export const getMe = async (ctx: Context): Promise<Context> => {
  const userId = (ctx.state.user as StateUser).id;
  const user = await repoGetUser(ctx.db, userId);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return ctx;
  }
  ctx.status = 200;
  ctx.body = user;
  return ctx;
};

export const updateDailyGoal = async (ctx: Context): Promise<Context> => {
  const val = updateDailyGoalBodySchema.safeParse(ctx.request.body);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: val.error.issues };
    return ctx;
  }

  const userId = (ctx.state.user as StateUser).id;
  const updated = await repoUpdateDaily(ctx.db, userId, val.data.dailyGoal);
  if (!updated) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return ctx;
  }

  ctx.status = 200;
  ctx.body = updated;
  return ctx;
};

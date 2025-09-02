import { Context } from 'koa';
import { planQuerySchema } from './requestSchemas';
import { getDailyPlan as repoGetDailyPlan } from '../repositories/planRepository';

type StateUser = { id: string };

export const getDailyPlan = async (ctx: Context): Promise<Context> => {
  const val = planQuerySchema.safeParse(ctx.request.query);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: val.error.issues };
    return ctx;
  }

  const userId = (ctx.state.user as StateUser).id;
  const result = await repoGetDailyPlan(ctx.db, userId, val.data.date);
  ctx.status = 200;
  ctx.body = result;
  return ctx;
};

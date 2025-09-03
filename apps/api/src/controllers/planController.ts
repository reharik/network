import { Context } from 'koa';
import { planQuerySchema } from '@network/contracts';
import type { PlanRepository } from '../repositories/planRepository';

type StateUser = { id: string };

export interface PlanController {
  getDailyPlan: (ctx: Context) => Promise<Context>;
}

export const createPlanController = (
  planRepository: PlanRepository,
): PlanController => ({
  getDailyPlan: async (ctx: Context): Promise<Context> => {
    const val = planQuerySchema.safeParse(ctx.request.query);
    if (!val.success) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid request format', issues: val.error.issues };
      return ctx;
    }

    const userId = (ctx.state.user as StateUser).id;
    const result = await planRepository.getDailyPlan(userId, val.data.date);
    ctx.status = 200;
    ctx.body = result;
    return ctx;
  },
});

import type { Context } from 'koa';
import type { PlanRepository } from '../repositories/planRepository';

export interface PlanController {
  getDailyPlan: (ctx: Context) => Promise<Context>;
}

export const createPlanController = ({
  planRepository,
}: {
  planRepository: PlanRepository;
}): PlanController => ({
  getDailyPlan: async (ctx: Context): Promise<Context> => {
    const userId = ctx.user.id;
    const { date } = ctx.query as { date?: string };
    const plan = await planRepository.getDailyPlan(userId, date);
    ctx.body = plan;
    return ctx;
  },
});

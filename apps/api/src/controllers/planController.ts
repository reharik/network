import { RESOLVER } from 'awilix';
import type { Context } from 'koa';
import type { Container } from '../container';
export interface PlanController {
  getDailyPlan: (ctx: Context) => Promise<Context>;
}

export const createPlanController = ({ planRepository }: Container): PlanController => ({
  getDailyPlan: async (ctx: Context): Promise<Context> => {
    const userId = ctx.user.id;
    const contacts = await planRepository.getDailyPlan(userId);
    ctx.body = contacts;
    return ctx;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanController as any)[RESOLVER] = {};

import type { Context } from 'koa';
import { Mappers } from '../repositories/mappers';
import type { PlanRepository } from '../repositories/planRepository';
export interface PlanController {
  getDailyPlan: (ctx: Context) => Promise<Context>;
}

export const createPlanController = ({
  planRepository,
  mappers,
}: {
  planRepository: PlanRepository;
  mappers: Mappers;
}): PlanController => ({
  getDailyPlan: async (ctx: Context): Promise<Context> => {
    const userId = ctx.user.id;
    const contacts = await planRepository.getDailyPlan(userId);
    ctx.body = contacts.map(mappers.toContactDTO);
    return ctx;
  },
});

// routes/plan.ts
import Router from '@koa/router';
import type { PlanController } from '../controllers/planController';

export interface PlanRoutes {
  router: Router;
}

export const createPlanRoutes = (
  planController: PlanController,
): PlanRoutes => {
  const router = new Router({ prefix: '/api/plan' });

  router.get('/', planController.getDailyPlan);

  return { router };
};

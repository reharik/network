// routes/plan.ts
import Router from '@koa/router';
import type { PlanController } from '../controllers/planController';

export interface PlanRoutes {
  mountRoutes: (router: Router) => void;
}

export const createPlanRoutes = ({
  planController,
}: {
  planController: PlanController;
}): PlanRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/plan', planController.getDailyPlan);
  },
});

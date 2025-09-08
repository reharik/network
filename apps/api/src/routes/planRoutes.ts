// routes/plan.ts
import Router from '@koa/router';
import type { PlanController } from '../controllers/planController';
import { requireAuth } from '../middleware/routeGuards';

export interface PlanRoutes {
  mountRoutes: (router: Router) => void;
}

export const createPlanRoutes = ({
  planController,
}: {
  planController: PlanController;
}): PlanRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/plan', requireAuth(planController.getDailyPlan));
  },
});

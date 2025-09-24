// routes/plan.ts
import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';
import { requireAuth } from '../middleware/routeGuards';

export interface PlanRoutes {
  mountRoutes: (router: Router) => void;
}

export const createPlanRoutes = ({ planController }: Container): PlanRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/plan', requireAuth(planController.getDailyPlan));
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanRoutes as any)[RESOLVER] = {};

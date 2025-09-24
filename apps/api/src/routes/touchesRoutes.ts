// routes/touches.ts
import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';
import { requireAuth } from '../middleware/routeGuards';

export interface TouchesRoutes {
  mountRoutes: (router: Router) => void;
}

export const createTouchesRoutes = ({ touchesController }: Container): TouchesRoutes => ({
  mountRoutes: (router: Router) => {
    router.post('/touches', requireAuth(touchesController.createTouch));
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createTouchesRoutes as any)[RESOLVER] = {};

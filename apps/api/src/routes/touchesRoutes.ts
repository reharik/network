// routes/touches.ts
import Router from '@koa/router';
import type { TouchesController } from '../controllers/touchesController';
import { requireAuth } from '../middleware/routeGuards';

export interface TouchesRoutes {
  mountRoutes: (router: Router) => void;
}

export const createTouchesRoutes = ({
  touchesController,
}: {
  touchesController: TouchesController;
}): TouchesRoutes => ({
  mountRoutes: (router: Router) => {
    router.post('/touches', requireAuth(touchesController.createTouch));
  },
});

// routes/touches.ts
import Router from '@koa/router';
import type { TouchesController } from '../controllers/touchesController';

export interface TouchesRoutes {
  router: Router;
}

export const createTouchesRoutes = (
  touchesController: TouchesController,
): TouchesRoutes => {
  const router = new Router({ prefix: '/api/touches' });

  router.post('/', touchesController.createTouch);

  return { router };
};

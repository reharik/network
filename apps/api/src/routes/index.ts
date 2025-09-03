import type Koa from 'koa';
import Router from '@koa/router';
import type { ContactRoutes } from './contactRoutes';
import type { TouchesRoutes } from './touchesRoutes';
import type { PlanRoutes } from './planRoutes';
import type { UserRoutes } from './userRoutes';

export interface Routes {
  mountRoutes: (app: Koa) => void;
}

export const createRoutes = (
  contactRoutes: ContactRoutes,
  touchesRoutes: TouchesRoutes,
  planRoutes: PlanRoutes,
  userRoutes: UserRoutes,
): Routes => ({
  mountRoutes: (app: Koa) => {
    const root = new Router();
    root.use(
      contactRoutes.router.routes(),
      contactRoutes.router.allowedMethods(),
    );
    root.use(
      touchesRoutes.router.routes(),
      touchesRoutes.router.allowedMethods(),
    );
    root.use(planRoutes.router.routes(), planRoutes.router.allowedMethods());
    root.use(userRoutes.router.routes(), userRoutes.router.allowedMethods());
    app.use(root.routes()).use(root.allowedMethods());
  },
});

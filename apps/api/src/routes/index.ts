import Router from '@koa/router';
import type { ContactRoutes } from './contactRoutes';
import type { TouchesRoutes } from './touchesRoutes';
import type { PlanRoutes } from './planRoutes';
import type { UserRoutes } from './userRoutes';
import type { AuthRoutes } from './authRoutes';

export interface Routes {
  mountRoutes: (router: Router) => void;
}

export const createRoutes = ({
  userRoutes,
  contactRoutes,
  planRoutes,
  touchesRoutes,
  authRoutes,
}: {
  userRoutes: UserRoutes;
  contactRoutes: ContactRoutes;
  planRoutes: PlanRoutes;
  touchesRoutes: TouchesRoutes;
  authRoutes: AuthRoutes;
}): Routes => ({
  mountRoutes: (router: Router) => {
    authRoutes.mountRoutes(router);
    userRoutes.mountRoutes(router);
    contactRoutes.mountRoutes(router);
    planRoutes.mountRoutes(router);
    touchesRoutes.mountRoutes(router);
  },
});

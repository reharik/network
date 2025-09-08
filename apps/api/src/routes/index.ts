import Router from '@koa/router';
import type { AuthRoutes } from './authRoutes';
import type { ContactRoutes } from './contactRoutes';
import type { PlanRoutes } from './planRoutes';
import type { TouchesRoutes } from './touchesRoutes';
import type { UserRoutes } from './userRoutes';

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

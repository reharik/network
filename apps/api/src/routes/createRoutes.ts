import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

export interface Routes {
  mountRoutes: (router: Router) => void;
}

export const createRoutes = ({
  userRoutes,
  contactRoutes,
  planRoutes,
  touchesRoutes,
  authRoutes,
  communicationRoutes,
  healthRoutes,
}: Container): Routes => ({
  mountRoutes: (router: Router) => {
    // Health check should be first (no auth required)
    healthRoutes.mountRoutes(router);
    authRoutes.mountRoutes(router);
    userRoutes.mountRoutes(router);
    contactRoutes.mountRoutes(router);
    planRoutes.mountRoutes(router);
    touchesRoutes.mountRoutes(router);
    communicationRoutes.mountRoutes(router);
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createRoutes as any)[RESOLVER] = {};

import Router from '@koa/router';
import { RESOLVER } from 'awilix';

export interface HealthRoutes {
  mountRoutes: (router: Router) => void;
}

export const createHealthRoutes = (): HealthRoutes => ({
  mountRoutes: (router: Router) => {
    // Health check endpoint (no auth required)
    router.get('/health', (ctx) => {
      // Basic health check - just return OK
      ctx.status = 200;
      ctx.body = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'network-api',
      };
    });
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createHealthRoutes as any)[RESOLVER] = {};

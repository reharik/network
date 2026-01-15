import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

export interface HealthRoutes {
  mountRoutes: (router: Router) => void;
}

export const createHealthRoutes = ({ logger }: Container): HealthRoutes => ({
  mountRoutes: (router: Router) => {
    // Health check endpoint (no auth required)
    router.get('/health', async (ctx) => {
      try {
        // Basic health check - just return OK
        ctx.status = 200;
        ctx.body = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'network-api',
        };
      } catch (error) {
        logger.error('Health check failed', error);
        ctx.status = 503;
        ctx.body = {
          status: 'error',
          timestamp: new Date().toISOString(),
        };
      }
    });
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createHealthRoutes as any)[RESOLVER] = {};

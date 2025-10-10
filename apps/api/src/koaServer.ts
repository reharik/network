import cors from '@koa/cors';
import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import dotenv from 'dotenv';
import http from 'http';
import Koa, { Context } from 'koa';
import { koaBody } from 'koa-body';
import type { Container } from './container';
import { database } from './knex';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { smartEnumRequestReviver } from './middleware/smartEnumRequestReviver';
import { smartEnumResponseSerializer } from './middleware/smartEnumResponseSerializer';

dotenv.config();

export type KoaServer = http.Server;

export const createKoaServer = ({ routes, optionalAuthMiddleware }: Container) => {
  const app = new Koa();
  app.context.db = database;
  // 1. Error handling (should be first)
  app.use(errorHandler);

  // 2. Request logging (early in pipeline)
  app.use(requestLogger);

  // 3. CORS (before body parsing)
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  // 4. Body parsing (must be before request processing)
  app.use(koaBody());

  // 5. Smart enum request revival (after body parsing)
  app.use(smartEnumRequestReviver);

  // 6. Auth middleware (before routes)
  app.use(optionalAuthMiddleware);

  // 7. Routes (the actual request handling)
  const router = new Router({ prefix: '/api' });
  routes.mountRoutes(router);
  app.use(router.routes()).use(router.allowedMethods());

  // 8. Smart enum response serialization (LAST - after routes)
  app.use(smartEnumResponseSerializer);

  app.on('error', (err: Error, ctx: Context) => {
    console.error(`Unhandled error on ${ctx.method} ${ctx.path}`, {
      status: ctx.status,
      requestId: ctx.get('x-request-id') || undefined,
    });
    if (err?.stack) console.error(err.stack);
    else console.error(err);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection:', reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('uncaughtException:', err);
  });

  return http.createServer(app.callback());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createKoaServer as any)[RESOLVER] = {};

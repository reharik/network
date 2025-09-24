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

dotenv.config();

export type KoaServer = http.Server;

export const createKoaServer = ({
  smartEnumReviver,
  routes,
  optionalAuthMiddleware,
}: Container) => {
  const app = new Koa();
  app.context.db = database;

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

  app.use(errorHandler);
  app.use(requestLogger);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  // Use enhanced koa-bodyparser with custom reviver for smart enum transformation
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  app.use(koaBody({ customReviver: smartEnumReviver } as any));

  // Mount routes using the container
  const router = new Router({ prefix: '/api' });
  routes.mountRoutes(router);

  // Apply optional auth middleware globally - adds isLoggedIn flag to context
  app.use(optionalAuthMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  return http.createServer(app.callback());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createKoaServer as any)[RESOLVER] = {};

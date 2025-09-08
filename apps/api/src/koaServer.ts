import Koa from 'koa';
import { koaBody } from 'koa-body';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import http from 'http';
import { database } from './knex';
import { requestLogger } from './middleware/requestLogger';
import { createAuthMiddleware } from './middleware/authMiddleware';
import { Context } from 'koa';
import { container } from './container';
import Router from '@koa/router';
dotenv.config();

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
app.use(koaBody());

// Mount routes using the container
const routes = container.resolve('routes');
const authService = container.resolve('authService');
const authMiddleware = createAuthMiddleware(authService);

const router = new Router({ prefix: '/api' });
routes.mountRoutes(router);

// Apply auth middleware to protected routes (everything except auth routes)
router.use('/me', authMiddleware);
router.use('/contacts', authMiddleware);
router.use('/plan', authMiddleware);
router.use('/touches', authMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());
export { server };

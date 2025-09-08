import cors from '@koa/cors';
import Router from '@koa/router';
import dotenv from 'dotenv';
import http from 'http';
import Koa, { Context } from 'koa';
import { koaBody } from 'koa-body';
import { container } from './container';
import { database } from './knex';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
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
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);
app.use(koaBody());

// Mount routes using the container
const routes = container.resolve('routes');
const optionalAuthMiddleware = container.resolve('optionalAuthMiddleware');

const router = new Router({ prefix: '/api' });
routes.mountRoutes(router);

// Apply optional auth middleware globally - adds isLoggedIn flag to context
app.use(optionalAuthMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());
export { server };

import Koa from 'koa';
import { koaBody } from 'koa-body';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import http from 'http';
import { db } from './knex';
import { requestLogger } from './middleware/requestLogger';
import { Context } from 'koa';
import { container } from './container';
dotenv.config();

const app = new Koa();
app.context.db = db;

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
routes.mountRoutes(app);

const server = http.createServer(app.callback());
export { server };

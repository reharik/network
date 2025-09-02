import Koa from 'koa';
import { koaBody } from 'koa-body';
import { contactsRouter } from './routes/contactRoutes';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import http from 'http';
import { db } from './knex';

dotenv.config();

const app = new Koa();
app.context.db = db;

app.use(errorHandler);
app.use(koaBody());
app.use(contactsRouter.routes()).use(contactsRouter.allowedMethods());

const server = http.createServer(app.callback());
export { server };

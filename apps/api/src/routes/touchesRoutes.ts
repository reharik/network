// routes/touches.ts
import Router from '@koa/router';
import { createTouch } from '../controllers/touchesController';

export const touchesRouter = new Router({ prefix: '/api/touches' });
touchesRouter.post('/', createTouch);

import type Koa from 'koa';
import Router from '@koa/router';
import { contactsRouter } from './contactRoutes';
import { touchesRouter } from './touchesRoutes';
import { planRouter } from './planRoutes';
import { userRouter } from './userRoutes';

export const mountRoutes = (app: Koa) => {
  const root = new Router();
  root.use(contactsRouter.routes(), contactsRouter.allowedMethods());
  root.use(touchesRouter.routes(), touchesRouter.allowedMethods());
  root.use(planRouter.routes(), planRouter.allowedMethods());
  root.use(userRouter.routes(), userRouter.allowedMethods());
  app.use(root.routes()).use(root.allowedMethods());
};

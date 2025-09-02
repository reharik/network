// routes/plan.ts
import Router from '@koa/router';
import { getDailyPlan } from '../controllers/planController';

export const planRouter = new Router({ prefix: '/api/plan' });
planRouter.get('/', getDailyPlan);

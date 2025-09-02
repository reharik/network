// routes/user.ts
import Router from '@koa/router';
import { getMe, updateDailyGoal } from '../controllers/userController';

export const userRouter = new Router({ prefix: '/api/me' });
userRouter.get('/', getMe);
userRouter.patch('/daily-goal', updateDailyGoal);

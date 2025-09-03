// routes/user.ts
import Router from '@koa/router';
import type { UserController } from '../controllers/userController';

export interface UserRoutes {
  router: Router;
}

export const createUserRoutes = (
  userController: UserController,
): UserRoutes => {
  const router = new Router({ prefix: '/api/me' });

  router.get('/', userController.getMe);
  router.patch('/daily-goal', userController.updateDailyGoal);

  return { router };
};

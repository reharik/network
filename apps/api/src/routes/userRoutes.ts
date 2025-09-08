// routes/user.ts
import Router from '@koa/router';
import type { UserController } from '../controllers/userController';

export interface UserRoutes {
  mountRoutes: (router: Router) => void;
}

export const createUserRoutes = ({
  userController,
}: {
  userController: UserController;
}): UserRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/me', userController.getMe);
    router.put('/me/daily-goal', userController.updateDailyGoal);
  },
});

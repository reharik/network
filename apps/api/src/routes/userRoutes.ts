// routes/user.ts
import Router from '@koa/router';
import type { UserController } from '../controllers/userController';
import { requireAuth } from '../middleware/routeGuards';

export interface UserRoutes {
  mountRoutes: (router: Router) => void;
}

export const createUserRoutes = ({
  userController,
}: {
  userController: UserController;
}): UserRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/me', requireAuth(userController.getMe));
    router.put('/me/daily-goal', requireAuth(userController.updateDailyGoal));
  },
});

// routes/user.ts
import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';
import { requireAuth } from '../middleware/routeGuards';

export interface UserRoutes {
  mountRoutes: (router: Router) => void;
}

export const createUserRoutes = ({ userController }: Container): UserRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/me', requireAuth(userController.getMe));
    router.put('/me/daily-goal', requireAuth(userController.updateDailyGoal));
    router.put('/me/profile', requireAuth(userController.updateProfile));
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createUserRoutes as any)[RESOLVER] = {};

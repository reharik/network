import Router from '@koa/router';
import type { AuthController } from '../controllers/authController';

export interface AuthRoutes {
  mountRoutes: (router: Router) => void;
}

export const createAuthRoutes = ({
  authController,
}: {
  authController: AuthController;
}): AuthRoutes => ({
  mountRoutes: (router: Router) => {
    router.post('/auth/login', authController.login);
    router.post('/auth/logout', authController.logout);
    router.get('/auth/me', authController.me);
  },
});

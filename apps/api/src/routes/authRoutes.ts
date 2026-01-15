import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

export interface AuthRoutes {
  mountRoutes: (router: Router) => void;
}

export const createAuthRoutes = ({ authController }: Container): AuthRoutes => ({
  mountRoutes: (router: Router) => {
    router.post('/auth/login', authController.login);
    router.post('/auth/signup', authController.signup);
    router.post('/auth/logout', authController.logout);
    router.get('/auth/me', authController.me);
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createAuthRoutes as any)[RESOLVER] = {};

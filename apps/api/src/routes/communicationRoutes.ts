import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';
import { requireAuth } from '../middleware/routeGuards';

export interface CommunicationRoutes {
  mountRoutes: (router: Router) => void;
}

export const createCommunicationRoutes = ({
  communicationController,
}: Container): CommunicationRoutes => ({
  mountRoutes: (router: Router) => {
    router.post('/email', requireAuth(communicationController.sendEmail));
    router.post('/sms', requireAuth(communicationController.sendSms));
    router.post('/voice/call', requireAuth(communicationController.makeCall));
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createCommunicationRoutes as any)[RESOLVER] = { lifetime: 'SINGLETON' };

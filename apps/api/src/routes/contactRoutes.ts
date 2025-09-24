import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';
import { requireAuth } from '../middleware/routeGuards';

export interface ContactRoutes {
  mountRoutes: (router: Router) => void;
}

export const createContactRoutes = ({ contactsController }: Container): ContactRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/contacts', requireAuth(contactsController.getContacts));
    router.get('/contacts/:id', requireAuth(contactsController.getContact));
    router.post('/contacts', requireAuth(contactsController.createContact));
    router.patch('/contacts/:id', requireAuth(contactsController.patchContact));
    router.post('/contacts/import', requireAuth(contactsController.importContacts));
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createContactRoutes as any)[RESOLVER] = {};

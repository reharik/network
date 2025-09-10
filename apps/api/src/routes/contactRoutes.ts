import Router from '@koa/router';
import type { ContactsController } from '../controllers/contactsController';
import { requireAuth } from '../middleware/routeGuards';

export interface ContactRoutes {
  mountRoutes: (router: Router) => void;
}

export const createContactRoutes = ({
  contactsController,
}: {
  contactsController: ContactsController;
}): ContactRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/contacts', requireAuth(contactsController.getContacts));
    router.post('/contacts', requireAuth(contactsController.createContact));
    router.patch('/contacts/:id', requireAuth(contactsController.patchContact));
    router.post('/contacts/import', requireAuth(contactsController.importContacts));
  },
});

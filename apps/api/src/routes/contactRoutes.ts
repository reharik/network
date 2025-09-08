import Router from '@koa/router';
import type { ContactsController } from '../controllers/contactsController';

export interface ContactRoutes {
  mountRoutes: (router: Router) => void;
}

export const createContactRoutes = ({
  contactsController,
}: {
  contactsController: ContactsController;
}): ContactRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/contacts', contactsController.getContacts);
    router.post('/contacts', contactsController.createContact);
    router.patch('/contacts/:id', contactsController.patchContact);
  },
});

import Router from '@koa/router';
import type { ContactsController } from '../controllers/contactsController';

export interface ContactRoutes {
  router: Router;
}

export const createContactRoutes = (
  contactsController: ContactsController,
): ContactRoutes => {
  const router = new Router({ prefix: '/api/contacts' });

  router.get('/', contactsController.getContacts);
  router.post('/', contactsController.createContact);
  // router.get('/:id', contactsController.getContact);
  router.patch('/:id', contactsController.patchContact);
  // router.get('/:id/suggestions', contactsController.getContactSuggestions);

  return { router };
};

import Router from '@koa/router';
import {
  getContacts,
  createContact,
  // getContact,
  patchContact,
  // getContactSuggestions,
} from '../controllers/contactsController';

export const contactsRouter = new Router({ prefix: '/api/contacts' });
contactsRouter.get('/', getContacts);
contactsRouter.post('/', createContact);
// contactsRouter.get('/:id', getContact);
contactsRouter.patch('/:id', patchContact);
// contactsRouter.get('/:id/suggestions', getContactSuggestions);

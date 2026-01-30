import Router from '@koa/router';
import { RESOLVER } from 'awilix';
import type { Context } from 'koa';
import type { Container } from '../container';
import { requireAuth } from '../middleware/routeGuards';
import type { TypedContext } from '../types/koa';

export interface ContactRoutes {
  mountRoutes: (router: Router) => void;
}

// Helper function to bridge TypedContext with Router's Context
// This is safe because Context already has params: Record<string, string>
// and TypedContext<T> extends Context with params: T where T extends Record<string, string>
const typedHandler = <T extends Record<string, string>>(
  handler: (ctx: TypedContext<T>) => Promise<Context>,
) => {
  return (ctx: Context) => handler(ctx as TypedContext<T>);
};

export const createContactRoutes = ({
  contactsController,
  touchesController,
}: Container): ContactRoutes => ({
  mountRoutes: (router: Router) => {
    router.get('/contacts', requireAuth(contactsController.getContacts));
    router.get(
      '/contacts/:id/touches',
      requireAuth(typedHandler(touchesController.listForContact)),
    );
    router.get('/contacts/:id', requireAuth(typedHandler(contactsController.getContact)));
    router.post('/contacts', requireAuth(contactsController.createContact));
    router.patch('/contacts/:id', requireAuth(typedHandler(contactsController.patchContact)));
    router.delete('/contacts/:id', requireAuth(typedHandler(contactsController.deleteContact)));
    router.post('/contacts/import', requireAuth(contactsController.importContacts));
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createContactRoutes as any)[RESOLVER] = {};

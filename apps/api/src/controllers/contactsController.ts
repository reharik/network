import { ContactMethod, ImportContactsDTO } from '@network/contracts';
import { validateUpsertContact } from '@network/validators';
import { RESOLVER } from 'awilix';
import type { Context } from 'koa';
import type { Container } from '../container';

export interface ContactsController {
  getContacts: (ctx: Context) => Promise<Context>;
  getContact: (ctx: Context) => Promise<Context>;
  createContact: (ctx: Context) => Promise<Context>;
  patchContact: (ctx: Context) => Promise<Context>;
  importContacts: (ctx: Context) => Promise<Context>;
}

export const createContactsController = ({
  contactRepository,
  importService,
}: Container): ContactsController => ({
  getContacts: async (ctx: Context) => {
    const userId = ctx.user.id;
    const entities = await contactRepository.listContacts(userId, {
      /* dueOnly, q parsed elsewhere if needed */
    });

    // Smart enums middleware will handle serialization
    ctx.status = 200;
    ctx.body = { contacts: entities };
    return ctx;
  },

  getContact: async (ctx: Context) => {
    const userId = ctx.user.id;
    const contactId = ctx.params.id;

    const entity = await contactRepository.getContact(userId, contactId);
    if (!entity) {
      ctx.status = 404;
      ctx.body = { error: 'Contact not found' };
      return ctx;
    }

    // Smart enums middleware will handle serialization
    ctx.status = 200;
    ctx.body = entity;
    return ctx;
  },

  createContact: async (ctx: Context) => {
    const validation = validateUpsertContact(ctx.request.body);
    if (!validation.success) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid request format',
        issues: validation.errors,
      };
      return ctx;
    }
    const userId = ctx.user.id;

    const entity = await contactRepository.createContact(userId, {
      ...validation.data,
      preferredMethod: validation.data.preferredMethod ?? ContactMethod.email,
    });

    ctx.status = 201;
    ctx.body = entity;
    return ctx;
  },

  patchContact: async (ctx: Context) => {
    const validation = validateUpsertContact(ctx.request.body);
    if (!validation.success) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid request format',
        issues: validation.errors,
      };
      return ctx;
    }
    const userId = ctx.user.id;

    const entity = await contactRepository.patchContact(userId, ctx.params.id, validation.data);
    if (!entity) {
      ctx.status = 404;
      ctx.body = { error: 'Contact not found' };
      return ctx;
    }

    // Smart enums middleware will handle serialization
    ctx.status = 200;
    ctx.body = entity;
    return ctx;
  },

  importContacts: async (ctx: Context) => {
    const body = ctx.request.body as {
      rows: ImportContactsDTO[];
    };

    if (!body.rows || !Array.isArray(body.rows)) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid request format. Expected { rows: ImportRow[] }' };
      return ctx;
    }

    const userId = ctx.user.id;
    const result = await importService.importContacts(userId, body.rows);

    ctx.status = 200;
    ctx.body = result;
    return ctx;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createContactsController as any)[RESOLVER] = {};

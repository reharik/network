import type { ContactDTO, ContactListDTO } from '@network/contracts';
import { ContactDTOPartial, ContactMethod, upsertContactSchema } from '@network/contracts';
import type { Context } from 'koa';
import type { ContactRepository } from '../repositories/contactRepository';
import type { Mappers } from '../repositories/mappers';

export interface ContactsController {
  getContacts: (ctx: Context) => Promise<Context>;
  createContact: (ctx: Context) => Promise<Context>;
  patchContact: (ctx: Context) => Promise<Context>;
}

export const createContactsController = ({
  contactRepository,
  mappers,
}: {
  contactRepository: ContactRepository;
  mappers: Mappers;
}): ContactsController => ({
  getContacts: async (ctx: Context) => {
    const userId = ctx.user.id;
    const entities = await contactRepository.listContacts(userId, {
      /* dueOnly, q parsed elsewhere if needed */
    });
    const rows: ContactListDTO = mappers.toContactListDTO(entities);
    ctx.status = 200;
    ctx.body = rows;
    return ctx;
  },

  createContact: async (ctx: Context) => {
    const parsed = upsertContactSchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid request format',
        issues: parsed.error.issues,
      };
      return ctx;
    }
    const body: ContactDTOPartial = parsed.data;
    const userId = ctx.user.id;

    const entity = await contactRepository.createContact(userId, {
      ...body,
      preferredMethod: body.preferredMethod ?? ContactMethod.email.value,
    });
    const created: ContactDTO = mappers.toContactDTO(entity);

    ctx.status = 201;
    ctx.body = created;
    return ctx;
  },

  patchContact: async (ctx: Context) => {
    const parsed = upsertContactSchema.safeParse(ctx.request.body);
    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid request format',
        issues: parsed.error.issues,
      };
      return ctx;
    }
    const body: ContactDTOPartial = parsed.data;
    const userId = ctx.user.id;

    const entity = await contactRepository.patchContact(userId, ctx.params.id, body);
    if (!entity) {
      ctx.status = 404;
      ctx.body = { error: 'Contact not found' };
      return ctx;
    }

    const updated: ContactDTO = mappers.toContactDTO(entity);
    ctx.status = 200;
    ctx.body = updated;
    return ctx;
  },
});

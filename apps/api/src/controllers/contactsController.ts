import { Context } from 'koa';
import { ContactMethod, upsertContactSchema } from '@network/contracts';
import {
  listContacts,
  createContact as createContactDB,
  patchContact as patchContactDB,
} from '../repositories/contactRepository';
import { ContactDTOPartial } from '../repositories/dtos';

export const getContacts = async (ctx: Context) => {
  const userId = ctx.user.id;
  const rows = await listContacts(ctx.db, userId, {
    /* dueOnly, q parsed elsewhere if needed */
  });
  ctx.status = 200;
  ctx.body = rows;
  return ctx;
};

export const createContact = async (ctx: Context) => {
  const parsed = upsertContactSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: parsed.error.issues };
    return ctx;
  }
  const body: ContactDTOPartial = parsed.data;
  const userId = ctx.user.id;

  const created = await createContactDB(ctx.db, userId, {
    ...body,
    preferredMethod: body.preferredMethod ?? ContactMethod.email.value,
  });

  ctx.status = 201;
  ctx.body = created;
  return ctx;
};

export const patchContact = async (ctx: Context) => {
  const parsed = upsertContactSchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: parsed.error.issues };
    return ctx;
  }
  const body: ContactDTOPartial = parsed.data;
  const userId = ctx.user.id;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const updated = await patchContactDB(ctx.db, userId, ctx.params.id, body);
  if (!updated) {
    ctx.status = 404;
    ctx.body = { error: 'Contact not found' };
    return ctx;
  }

  ctx.status = 200;
  ctx.body = updated;
  return ctx;
};

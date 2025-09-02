import { Context } from 'koa';
import {
  ContactMethod,
  createContactBodySchema,
  patchContactBodySchema,
} from '@contracts';
import type { CreateContactBody, PatchContactBody } from '@contracts';
import {
  listContacts as repoList,
  createContact as repoCreate,
  getContact as repoGet,
  patchContact as repoPatch,
} from '../repositories/contactRepository';

export const getContacts = async (ctx: Context) => {
  const userId = ctx.state.user.id as string;
  const rows = await repoList(ctx.db, userId, {
    /* dueOnly, q parsed elsewhere if needed */
  });
  ctx.status = 200;
  ctx.body = rows;
  return ctx;
};

export const createContact = async (ctx: Context) => {
  const parsed = createContactBodySchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: parsed.error.issues };
    return ctx;
  }
  const body: CreateContactBody = parsed.data;
  const userId = ctx.state.user.id as string;

  const created = await repoCreate(ctx.db, userId, {
    ...body,
    preferredMethod: body.preferredMethod ?? ContactMethod.email.value,
  });

  ctx.status = 201;
  ctx.body = created;
  return ctx;
};

export const patchContact = async (ctx: Context) => {
  const parsed = patchContactBodySchema.safeParse(ctx.request.body);
  if (!parsed.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: parsed.error.issues };
    return ctx;
  }
  const body: PatchContactBody = parsed.data;
  const userId = ctx.state.user.id as string;

  const updated = await repoPatch(ctx.db, userId, ctx.params.id, body);
  if (!updated) {
    ctx.status = 404;
    ctx.body = { error: 'Contact not found' };
    return ctx;
  }

  ctx.status = 200;
  ctx.body = updated;
  return ctx;
};

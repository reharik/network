import type { Knex } from 'knex';
import type {
  Contact,
  CreateContactBody,
  PatchContactBody,
} from '@network/contracts';

export type ListContactsOpts = { dueOnly?: boolean; q?: string };

export const listContacts = async (
  db: Knex,
  userId: string,
  opts?: ListContactsOpts,
) => {
  let q = db<Contact>('contacts').where({ userId });
  if (opts?.dueOnly) q = q.andWhere('nextDueAt', '<=', db.fn.now());
  if (opts?.q) {
    q = q.andWhere((qb) => {
      qb.whereILike('firstName', `%${opts.q}%`)
        .orWhereILike('lastName', `%${opts.q}%`)
        .orWhereILike('email', `%${opts.q}%`)
        .orWhereILike('phone', `%${opts.q}%`);
    });
  }
  return q.orderBy([
    { column: 'lastName', order: 'asc' },
    { column: 'firstName', order: 'asc' },
  ]);
};

export const createContact = async (
  db: Knex,
  userId: string,
  body: CreateContactBody,
) => {
  const payload = {
    id: db.raw('gen_random_uuid()'),
    userId,
    firstName: body.firstName,
    lastName: body.lastName,
    preferredMethod: body?.preferredMethod?.value ?? 'EMAIL',
    email: body.email ?? null,
    phone: body.phone ?? null,
    notes: body.notes ?? null,
    intervalDays: body.intervalDays ?? 14,
    nextDueAt: db.fn.now(),
  };
  const [row] = await db<Contact>('contacts').insert(payload).returning('*');
  return row;
};

export const getContact = (db: Knex, userId: string, id: string) =>
  db<Contact>('contacts').where({ id, userId }).first();

export const patchContact = async (
  db: Knex,
  userId: string,
  id: string,
  patch: PatchContactBody,
) => {
  const existing = await db<Contact>('contacts').where({ id, userId }).first();
  if (!existing) return null;

  const updates: Partial<Contact> = {};
  if (patch.firstName !== undefined) updates.firstName = patch.firstName;
  if (patch.lastName !== undefined) updates.lastName = patch.lastName;
  if (patch.preferredMethod !== undefined)
    updates.preferredMethod = patch.preferredMethod;
  if (patch.email !== undefined) updates.email = patch.email;
  if (patch.phone !== undefined) updates.phone = patch.phone;
  if (patch.notes !== undefined) updates.notes = patch.notes;
  if (patch.paused !== undefined) updates.paused = !!patch.paused;
  if (patch.snoozedUntil !== undefined)
    updates.snoozedUntil = patch.snoozedUntil ?? null;
  if (patch.intervalDays !== undefined) {
    updates.intervalDays = patch.intervalDays;
    const base = existing.lastTouchedAt
      ? new Date(existing.lastTouchedAt)
      : new Date();
    updates.nextDueAt = new Date(
      base.getTime() + patch.intervalDays * 86_400_000,
    ).toISOString() as any;
  }

  const [row] = await db<Contact>('contacts')
    .where({ id, userId })
    .update(updates, '*');
  return row ?? null;
};

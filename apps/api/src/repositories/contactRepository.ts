import type { Knex } from 'knex';
import { ContactDTOPartial } from './dtos';
import { toContactEntity } from './mappers';
import { v4 } from 'uuid';

export type ListContactsOpts = { dueOnly?: boolean; q?: string };

export const listContacts = async (
  db: Knex,
  userId: string,
  opts?: ListContactsOpts,
) => {
  let q = db('contacts').where({ userId });
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
  data: ContactDTOPartial,
) => {
  const payload: ContactDTOPartial = {
    ...data,
    id: v4(),
    userId,
  };
  const [row] = await db('contacts').insert(payload).returning('*');
  return toContactEntity(row);
};

export const getContact = async (db: Knex, userId: string, id: string) => {
  const dto = await db('contacts').where({ id, userId }).first();
  toContactEntity(dto);
};

export const patchContact = async (
  db: Knex,
  userId: string,
  id: string,
  data: Partial<ContactDTOPartial>,
) => {
  const existing = await db('contacts').where({ id, userId }).first();
  if (!existing) return null;

  const updates: Partial<ContactDTOPartial> = { ...existing, ...data };

  const [row] = await db('contacts').where({ id, userId }).update(updates, '*');
  return row ?? null;
};

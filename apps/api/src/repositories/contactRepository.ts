import type { Knex } from 'knex';
import { ContactDTOPartial } from '@network/contracts';
import type { Mappers } from './mappers';
import type { Contact } from '@network/contracts';
import { v4 } from 'uuid';

export type ListContactsOpts = { dueOnly?: boolean; q?: string };

export interface ContactRepository {
  listContacts: (userId: string, opts?: ListContactsOpts) => Promise<Contact[]>;
  createContact: (userId: string, data: ContactDTOPartial) => Promise<Contact>;
  getContact: (userId: string, id: string) => Promise<Contact | undefined>;
  patchContact: (
    userId: string,
    id: string,
    data: Partial<ContactDTOPartial>,
  ) => Promise<Contact | undefined>;
}

export const createContactRepository = (
  db: Knex,
  mappers: Mappers,
): ContactRepository => ({
  listContacts: async (userId: string, opts?: ListContactsOpts) => {
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
    const rows = await q.orderBy([
      { column: 'lastName', order: 'asc' },
      { column: 'firstName', order: 'asc' },
    ]);

    // Convert DB rows to entities
    const entities = rows
      .map((row) => mappers.toContactEntity(row))
      .filter((entity): entity is Contact => entity !== undefined);
    return entities;
  },

  createContact: async (userId: string, data: ContactDTOPartial) => {
    const payload: ContactDTOPartial = {
      ...data,
      id: v4(),
      userId,
    };
    const [row] = await db('contacts').insert(payload).returning('*');
    const entity = mappers.toContactEntity(row);
    if (!entity) throw new Error('Failed to create contact');
    return entity;
  },

  getContact: async (userId: string, id: string) => {
    const dto = await db('contacts').where({ id, userId }).first();
    return mappers.toContactEntity(dto);
  },

  patchContact: async (
    userId: string,
    id: string,
    data: Partial<ContactDTOPartial>,
  ) => {
    const existing = await db('contacts').where({ id, userId }).first();
    if (!existing) return undefined;

    const updates: Partial<ContactDTOPartial> = { ...existing, ...data };

    const [row] = await db('contacts')
      .where({ id, userId })
      .update(updates, '*');
    const entity = mappers.toContactEntity(row);
    return entity || undefined;
  },
});

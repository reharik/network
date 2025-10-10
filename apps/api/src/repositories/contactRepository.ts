import { Contact, UpdateContact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { prepareForDatabase, reviveFromDatabase } from 'smart-enums';
import { v4 } from 'uuid';
import type { Container } from '../container';

export type ListContactsOpts = { dueOnly?: boolean; q?: string };

export interface ContactRepository {
  listContacts: (userId: string, opts?: ListContactsOpts) => Promise<Contact[]>;
  createContact: (userId: string, data: UpdateContact) => Promise<Contact>;
  getContact: (userId: string, id: string) => Promise<Contact | undefined>;
  patchContact: (
    userId: string,
    id: string,
    data: Partial<UpdateContact>,
  ) => Promise<Contact | undefined>;
  deleteContact: (userId: string, id: string) => Promise<boolean>;
}

export const createContactRepository = ({ connection }: Container): ContactRepository => ({
  listContacts: async (userId: string, opts?: ListContactsOpts) => {
    let q = connection('contacts').where({ userId });
    if (opts?.dueOnly) q = q.andWhere('nextDueAt', '<=', connection.fn.now());
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
    return reviveFromDatabase<Contact[]>(rows);
  },
  createContact: async (userId: string, data: UpdateContact) => {
    const payload: UpdateContact = {
      ...data,
      id: v4(),
      userId,
    };
    const dbPayload = prepareForDatabase(payload);
    const [row] = await connection('contacts').insert(dbPayload).returning('*');
    return reviveFromDatabase<Contact>(row, {
      fieldEnumMapping: {
        preferredMethod: ['ContactMethod'],
      },
    });
  },
  getContact: async (userId: string, id: string) => {
    const dto = await connection('contacts').where({ id, userId }).first();
    return dto
      ? reviveFromDatabase<Contact>(dto, {
          fieldEnumMapping: {
            preferredMethod: ['ContactMethod'],
          },
        })
      : undefined;
  },
  patchContact: async (userId: string, id: string, data: Partial<UpdateContact>) => {
    const existing = await connection('contacts').where({ id, userId }).first();
    if (!existing) return undefined;
    const updates = { ...existing, ...data };
    const dbUpdates = prepareForDatabase(updates);
    await connection('contacts').where({ id, userId }).update(dbUpdates);
    const updated = await connection('contacts').where({ id, userId }).first();
    return updated
      ? reviveFromDatabase<Contact>(updated, {
          fieldEnumMapping: {
            preferredMethod: ['ContactMethod'],
          },
        })
      : undefined;
  },
  deleteContact: async (userId: string, id: string) => {
    const deletedCount = await connection('contacts').where({ id, userId }).del();
    return deletedCount > 0;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access
(createContactRepository as any)[RESOLVER] = {};

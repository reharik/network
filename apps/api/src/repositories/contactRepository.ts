import { ContactDTO, ContactDTOPartial } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { v4 } from 'uuid';
import type { Container } from '../container';

export type ListContactsOpts = { dueOnly?: boolean; q?: string };

export interface ContactRepository {
  listContacts: (userId: string, opts?: ListContactsOpts) => Promise<ContactDTO[]>;
  createContact: (userId: string, data: ContactDTOPartial) => Promise<ContactDTO>;
  getContact: (userId: string, id: string) => Promise<ContactDTO | undefined>;
  patchContact: (
    userId: string,
    id: string,
    data: Partial<ContactDTOPartial>,
  ) => Promise<ContactDTO | undefined>;
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
    return rows;
  },
  createContact: async (userId: string, data: ContactDTOPartial) => {
    const payload: ContactDTOPartial = {
      ...data,
      id: v4(),
      userId,
    };
    const [row] = await connection('contacts').insert(payload).returning('*');
    return row;
  },
  getContact: async (userId: string, id: string) => {
    const dto = await connection('contacts').where({ id, userId }).first();
    return dto;
  },
  patchContact: async (userId: string, id: string, data: Partial<ContactDTOPartial>) => {
    const existing = await connection('contacts').where({ id, userId }).first();
    if (!existing) return undefined;
    const updates: Partial<ContactDTOPartial> = { ...existing, ...data };
    const [row] = await connection('contacts').where({ id, userId }).update(updates, '*');
    return row;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access
(createContactRepository as any)[RESOLVER] = {};

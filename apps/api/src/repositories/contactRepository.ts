import type { Contact, UpdateContact } from '@network/contracts';
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

export const createContactRepository = ({ connection, logger }: Container): ContactRepository => ({
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
    try {
      const payload: UpdateContact = {
        ...data,
        id: v4(),
        userId,
      };
      const dbPayload = prepareForDatabase(payload);
      const [row] = await connection('contacts').insert(dbPayload).returning('*');
      const contact = reviveFromDatabase<Contact>(row, {
        fieldEnumMapping: {
          preferredMethod: ['ContactMethod'],
        },
      });
      logger.info('Contact created', {
        userId,
        contactId: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
      });
      return contact;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to create contact', err, {
        userId,
        contactData: {
          firstName: data.firstName,
          lastName: data.lastName,
          hasEmail: !!data.email,
          hasPhone: !!data.phone,
        },
      });
      throw error;
    }
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
    try {
      const existing = await connection('contacts').where({ id, userId }).first();
      if (!existing) {
        logger.warn('Contact not found for update', { userId, contactId: id });
        return undefined;
      }
      const updates = { ...existing, ...data };
      const dbUpdates = prepareForDatabase(updates);
      await connection('contacts').where({ id, userId }).update(dbUpdates);
      const updated = await connection('contacts').where({ id, userId }).first();
      const result = updated
        ? reviveFromDatabase<Contact>(updated, {
            fieldEnumMapping: {
              preferredMethod: ['ContactMethod'],
            },
          })
        : undefined;
      if (result) {
        logger.info('Contact updated', {
          userId,
          contactId: id,
          updatedFields: Object.keys(data),
        });
      }
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to update contact', err, {
        userId,
        contactId: id,
      });
      throw error;
    }
  },
  deleteContact: async (userId: string, id: string) => {
    try {
      const deletedCount = await connection('contacts').where({ id, userId }).del();
      const deleted = deletedCount > 0;
      if (deleted) {
        logger.info('Contact deleted', { userId, contactId: id });
      } else {
        logger.warn('Contact not found for deletion', { userId, contactId: id });
      }
      return deleted;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to delete contact', err, {
        userId,
        contactId: id,
      });
      throw error;
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access
(createContactRepository as any)[RESOLVER] = {};

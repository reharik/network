import type { Contact, ContactEmail, ContactPhone, UpdateContact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { prepareForDatabase, reviveFromDatabase } from 'smart-enums';
import { v4 } from 'uuid';
import type { Container } from '../container';

export type ListContactsOpts = { dueOnly?: boolean; q?: string };

function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const out = { ...obj };
  for (const k of keys) delete out[k];
  return out as Omit<T, K>;
}

async function hydrateContactEmailsPhones(
  connection: Container['connection'],
  contact: Contact,
): Promise<Contact> {
  const [emailRows, phoneRows] = await Promise.all([
    connection('contact_emails').where({ contactId: contact.id }).orderBy('isDefault', 'desc'),
    connection('contact_phones').where({ contactId: contact.id }).orderBy('isDefault', 'desc'),
  ]);
  const emails = emailRows as ContactEmail[];
  const phones = phoneRows as ContactPhone[];
  const primaryEmail = emails.find((e) => e.isDefault) ?? emails[0];
  const primaryPhone = phones.find((p) => p.isDefault) ?? phones[0];
  const phone = primaryPhone?.phone;
  return {
    ...contact,
    emails: emails.length ? emails : undefined,
    phones: phones.length ? phones : undefined,
    email: primaryEmail?.email,
    phone,
    sms: phone,
    call: phone,
  };
}

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
      const search = `%${opts.q}%`;
      const emailContactIds = await connection('contact_emails')
        .join('contacts', 'contacts.id', 'contact_emails.contactId')
        .where('contacts.userId', userId)
        .whereILike('contact_emails.email', search)
        .distinct('contacts.id')
        .pluck('contacts.id');
      const phoneContactIds = await connection('contact_phones')
        .join('contacts', 'contacts.id', 'contact_phones.contactId')
        .where('contacts.userId', userId)
        .whereILike('contact_phones.phone', search)
        .distinct('contacts.id')
        .pluck('contacts.id');
      const searchIds = [...new Set([...emailContactIds, ...phoneContactIds])];
      q = q.andWhere((qb) => {
        qb.whereILike('firstName', search).orWhereILike('lastName', search);
        if (searchIds.length) qb.orWhereIn('id', searchIds);
      });
    }
    const rows = await q.orderBy([
      { column: 'lastName', order: 'asc' },
      { column: 'firstName', order: 'asc' },
    ]);
    const contacts = reviveFromDatabase<Contact[]>(rows, {
      fieldEnumMapping: { preferredMethod: ['ContactMethod'] },
    });
    const hydrated: Contact[] = [];
    for (const c of contacts) {
      hydrated.push(await hydrateContactEmailsPhones(connection, c));
    }
    return hydrated;
  },

  createContact: async (userId: string, data: UpdateContact) => {
    const contactId = v4();
    const { email, phone, emails, phones, ...rest } = data;
    const payload = { ...rest, id: contactId, userId };
    const dbPayload = prepareForDatabase(payload);
    const cleanPayload = omit(dbPayload as Record<string, unknown>, [
      'email',
      'phone',
      'emails',
      'phones',
      'sms',
      'call',
    ]) as Record<string, unknown>;
    await connection('contacts').insert(cleanPayload);

    const emailsToInsert = emails?.length
      ? emails.map((e) => ({
          contactId,
          email: e.email,
          isDefault: !!e.isDefault,
        }))
      : email
        ? [{ contactId, email, isDefault: true }]
        : [];
    if (emailsToInsert.length) {
      if (emailsToInsert.length === 1) emailsToInsert[0].isDefault = true;
      await connection('contact_emails').insert(emailsToInsert);
    }

    const phonesToInsert = phones?.length
      ? phones.map((p) => ({
          contactId,
          phone: p.phone,
          isDefault: !!p.isDefault,
        }))
      : phone
        ? [{ contactId, phone, isDefault: true }]
        : [];
    if (phonesToInsert.length) {
      if (phonesToInsert.length === 1) phonesToInsert[0].isDefault = true;
      await connection('contact_phones').insert(phonesToInsert);
    }

    const created = await connection('contacts').where({ id: contactId, userId }).first();
    const contact = reviveFromDatabase<Contact>(created, {
      fieldEnumMapping: { preferredMethod: ['ContactMethod'] },
    });
    logger.info('Contact created', {
      userId,
      contactId,
      firstName: contact.firstName,
      lastName: contact.lastName,
    });
    return hydrateContactEmailsPhones(connection, contact);
  },

  getContact: async (userId: string, id: string) => {
    const dto = await connection('contacts').where({ id, userId }).first();
    if (!dto) return undefined;
    const contact = reviveFromDatabase<Contact>(dto, {
      fieldEnumMapping: { preferredMethod: ['ContactMethod'] },
    });
    return hydrateContactEmailsPhones(connection, contact);
  },

  patchContact: async (userId: string, id: string, data: Partial<UpdateContact>) => {
    const existing = await connection('contacts').where({ id, userId }).first();
    if (!existing) {
      logger.warn('Contact not found for update', { userId, contactId: id });
      return undefined;
    }
    const { emails, phones, ...rest } = data;
    const updates = { ...existing, ...rest };
    const dbUpdates = prepareForDatabase(updates);
    const cleanUpdates = omit(dbUpdates as Record<string, unknown>, [
      'email',
      'phone',
      'emails',
      'phones',
      'sms',
      'call',
    ]) as Record<string, unknown>;
    await connection('contacts').where({ id, userId }).update(cleanUpdates);

    if (emails !== undefined) {
      await connection('contact_emails').where({ contactId: id }).del();
      if (emails.length) {
        const rows = emails.map((e) => ({
          contactId: id,
          email: e.email,
          isDefault: !!e.isDefault,
        }));
        if (rows.length === 1) rows[0].isDefault = true;
        await connection('contact_emails').insert(rows);
      }
    }
    if (phones !== undefined) {
      await connection('contact_phones').where({ contactId: id }).del();
      if (phones.length) {
        const rows = phones.map((p) => ({
          contactId: id,
          phone: p.phone,
          isDefault: !!p.isDefault,
        }));
        if (rows.length === 1) rows[0].isDefault = true;
        await connection('contact_phones').insert(rows);
      }
    }

    const updated = await connection('contacts').where({ id, userId }).first();
    const result = updated
      ? reviveFromDatabase<Contact>(updated, {
          fieldEnumMapping: { preferredMethod: ['ContactMethod'] },
        })
      : undefined;
    if (result) {
      logger.info('Contact updated', { userId, contactId: id, updatedFields: Object.keys(data) });
      return hydrateContactEmailsPhones(connection, result);
    }
    return undefined;
  },

  deleteContact: async (userId: string, id: string) => {
    try {
      const deletedCount = await connection('contacts').where({ id, userId }).del();
      const deleted = deletedCount > 0;
      if (deleted) logger.info('Contact deleted', { userId, contactId: id });
      else logger.warn('Contact not found for deletion', { userId, contactId: id });
      return deleted;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to update contact', err, { userId, contactId: id });
      throw error;
    }
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createContactRepository as any)[RESOLVER] = {};

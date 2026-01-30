import type { Contact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import { DatabaseFormat, reviveFromDatabase } from 'smart-enums';
import type { Container } from '../container';

type EmailRow = { id: string; contactId: string; email: string; isDefault: boolean };
type PhoneRow = { id: string; contactId: string; phone: string; isDefault: boolean };

async function hydrateContactsEmailsPhones(
  connection: Container['connection'],
  contacts: Contact[],
): Promise<Contact[]> {
  if (contacts.length === 0) return contacts;
  const ids = contacts.map((c) => c.id);
  const [emailRows, phoneRows] = await Promise.all([
    connection('contact_emails').whereIn('contactId', ids).orderBy('isDefault', 'desc'),
    connection('contact_phones').whereIn('contactId', ids).orderBy('isDefault', 'desc'),
  ]);
  const emailsByContact = new Map<string, EmailRow[]>();
  const phonesByContact = new Map<string, PhoneRow[]>();
  for (const r of emailRows as EmailRow[]) {
    const list = emailsByContact.get(r.contactId) ?? [];
    list.push(r);
    emailsByContact.set(r.contactId, list);
  }
  for (const r of phoneRows as PhoneRow[]) {
    const list = phonesByContact.get(r.contactId) ?? [];
    list.push(r);
    phonesByContact.set(r.contactId, list);
  }
  return contacts.map((c) => {
    const emails = emailsByContact.get(c.id) ?? [];
    const phones = phonesByContact.get(c.id) ?? [];
    const primaryEmail = emails.find((e) => e.isDefault) ?? emails[0];
    const primaryPhone = phones.find((p) => p.isDefault) ?? phones[0];
    const phone = primaryPhone?.phone;
    return {
      ...c,
      emails: emails.length
        ? emails.map((e) => ({
            id: e.id,
            contactId: e.contactId,
            email: e.email,
            isDefault: e.isDefault,
          }))
        : undefined,
      phones: phones.length
        ? phones.map((p) => ({
            id: p.id,
            contactId: p.contactId,
            phone: p.phone,
            isDefault: p.isDefault,
          }))
        : undefined,
      email: primaryEmail?.email,
      phone,
      sms: phone,
      call: phone,
    };
  });
}

export interface PlanRepository {
  getDailyContacts: (
    userId: string,
    dayStart: DateTime,
    dailyGoal: number,
    carryoverContactIds?: string[],
  ) => Promise<Contact[]>;
  /** Touched today, excluding suspended (paused) contacts. Done at query level. */
  getTouchedContactsForDay: (userId: string, dayStart: DateTime) => Promise<Contact[]>;
  /** Counts for today: total distinct contacts touched, and how many were from Contact Now. */
  getTouchedTodayCounts: (
    userId: string,
    dayStart: DateTime,
  ) => Promise<{ total: number; fromContactNow: number }>;
}

export const createPlanRepository = ({ connection }: Container): PlanRepository => ({
  getDailyContacts: async (
    userId: string,
    dayStart: DateTime,
    dailyGoal: number,
    carryoverContactIds: string[] = [],
  ) => {
    // Fetch all due contacts (we'll randomize and limit in memory)
    // This ensures all due contacts have equal chance of being selected
    const allDue = await connection<DatabaseFormat<Contact>>('contacts')
      .where({ userId, paused: false })
      .andWhere((qb) =>
        qb.whereNull('snoozedUntil').orWhere('snoozedUntil', '<=', connection.fn.now()),
      )
      .andWhere('nextDueAt', '<=', dayStart.toJSDate())
      .orderBy('nextDueAt', 'asc'); // Primary sort by most overdue first

    const revived = reviveFromDatabase<Contact[]>(allDue, {
      fieldEnumMapping: {
        preferredMethod: ['ContactMethod'],
      },
    });

    // Randomize using seeded hash based on date, while preserving nextDueAt priority
    const seed = dayStart.toISODate() ?? '';
    const simpleHash = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    };

    // Separate carryover contacts (must appear) from others
    const carryoverContacts: Contact[] = [];
    const otherContacts: Contact[] = [];
    const carryoverSet = new Set(carryoverContactIds);

    for (const contact of revived) {
      if (carryoverSet.has(contact.id)) {
        carryoverContacts.push(contact);
      } else {
        otherContacts.push(contact);
      }
    }

    // Sort carryover contacts: prioritize by nextDueAt, then randomize
    carryoverContacts.sort((a, b) => {
      const dueA = a.nextDueAt ? new Date(a.nextDueAt).getTime() : 0;
      const dueB = b.nextDueAt ? new Date(b.nextDueAt).getTime() : 0;
      if (dueA !== dueB) {
        return dueA - dueB;
      }
      const hashA = simpleHash(a.id + seed);
      const hashB = simpleHash(b.id + seed);
      return hashA - hashB;
    });

    // Sort other contacts: prioritize by nextDueAt, then randomize
    otherContacts.sort((a, b) => {
      const dueA = a.nextDueAt ? new Date(a.nextDueAt).getTime() : 0;
      const dueB = b.nextDueAt ? new Date(b.nextDueAt).getTime() : 0;
      if (dueA !== dueB) {
        return dueA - dueB;
      }
      const hashA = simpleHash(a.id + seed);
      const hashB = simpleHash(b.id + seed);
      return hashA - hashB;
    });

    // Combine: carryover first (guaranteed to appear), then others
    const result = [...carryoverContacts, ...otherContacts];

    // Return only the number needed, then hydrate email/phone from contact_emails/contact_phones
    const sliced = result.slice(0, dailyGoal);
    return hydrateContactsEmailsPhones(connection, sliced);
  },

  getTouchedContactsForDay: async (userId: string, dayStart: DateTime) => {
    const dayEnd = dayStart.endOf('day').toJSDate();
    const dayStartJs = dayStart.toJSDate();
    const rows = await connection<DatabaseFormat<Contact>>('touch_logs')
      .select('contacts.*')
      .innerJoin('contacts', function () {
        this.on('contacts.id', '=', 'touch_logs.contactId').andOn(
          'contacts.userId',
          '=',
          'touch_logs.userId',
        );
      })
      .where('touch_logs.userId', userId)
      .whereBetween('touch_logs.createdAt', [dayStartJs, dayEnd])
      .where('contacts.paused', false);

    // Dedupe by contact id (multiple touches same day → one row per contact)
    const byId = new Map<string, (typeof rows)[0]>();
    for (const row of rows) {
      const id = (row as { id: string }).id;
      if (!byId.has(id)) byId.set(id, row);
    }
    const revived = reviveFromDatabase<Contact[]>(Array.from(byId.values()), {
      fieldEnumMapping: {
        preferredMethod: ['ContactMethod'],
      },
    });
    return hydrateContactsEmailsPhones(connection, revived);
  },

  getTouchedTodayCounts: async (userId: string, dayStart: DateTime) => {
    const dayEnd = dayStart.endOf('day').toJSDate();
    const dayStartJs = dayStart.toJSDate();
    const rows = await connection('touch_logs')
      .select('contactId')
      .select(connection.raw('bool_or("fromContactNow") as "fromContactNow"'))
      .where('userId', userId)
      .whereBetween('createdAt', [dayStartJs, dayEnd])
      .groupBy('contactId');
    type Row = { contactId: string; fromContactNow: boolean };
    const total = rows.length;
    const fromContactNow = (rows as unknown as Row[]).filter(
      (r) => r.fromContactNow === true,
    ).length;
    return { total, fromContactNow };
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanRepository as any)[RESOLVER] = {};

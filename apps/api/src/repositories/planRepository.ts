import { Contact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import { DatabaseFormat, reviveFromDatabase } from 'smart-enums';
import type { Container } from '../container';

export interface PlanRepository {
  getDailyContacts: (
    userId: string,
    dayStart: DateTime,
    dailyGoal: number,
    carryoverContactIds?: string[],
  ) => Promise<Contact[]>;
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

    // Return only the number needed
    return result.slice(0, dailyGoal);
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanRepository as any)[RESOLVER] = {};

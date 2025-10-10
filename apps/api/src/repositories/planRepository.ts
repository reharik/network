import { Contact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import { DatabaseFormat, reviveFromDatabase } from 'smart-enums';
import type { Container } from '../container';

export interface PlanRepository {
  getDailyContacts: (userId: string, dayStart: DateTime, dailyGoal: number) => Promise<Contact[]>;
}

export const createPlanRepository = ({ connection }: Container): PlanRepository => ({
  getDailyContacts: async (userId: string, dayStart: DateTime, dailyGoal: number) => {
    const due = await connection<DatabaseFormat<Contact>>('contacts')
      .where({ userId, paused: false })
      .andWhere((qb) =>
        qb.whereNull('snoozedUntil').orWhere('snoozedUntil', '<=', connection.fn.now()),
      )
      .andWhere('nextDueAt', '<=', dayStart.toJSDate())
      .orderBy([
        { column: 'nextDueAt', order: 'asc' },
        { column: 'updatedAt', order: 'asc' },
        { column: 'lastName', order: 'asc' },
      ])
      .limit(dailyGoal);
    return reviveFromDatabase<Contact[]>(due, {
      fieldEnumMapping: {
        preferredMethod: ['ContactMethod'],
      },
    });
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanRepository as any)[RESOLVER] = {};

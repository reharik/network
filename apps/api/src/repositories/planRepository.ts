import { ContactDTO, ContactMethod } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import { reviveSmartEnums } from 'smart-enums';
import type { Container } from '../container';

export interface PlanRepository {
  getDailyPlan: (userId: string) => Promise<ContactDTO[]>;
}

export const createPlanRepository = ({ connection }: Container): PlanRepository => ({
  getDailyPlan: async (userId: string) => {
    const user = await connection('users').where({ id: userId }).first();
    if (!user) return [];
    const dayStart = DateTime.now().startOf('day');
    const due = await connection<ContactDTO>('contacts')
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
      .limit(user.dailyGoal);
    return reviveSmartEnums<ContactDTO[]>(due, { preferredMethod: ContactMethod });
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanRepository as any)[RESOLVER] = {};

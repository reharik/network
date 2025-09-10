import { Contact, ContactDTO } from '@network/contracts';
import type { Knex } from 'knex';
import { DateTime } from 'luxon';
import type { Mappers } from './mappers';

export interface PlanRepository {
  getDailyPlan: (userId: string) => Promise<Contact[]>;
}

export const createPlanRepository = ({
  connection,
  mappers,
}: {
  connection: Knex;
  mappers: Mappers;
}): PlanRepository => ({
  getDailyPlan: async (userId: string) => {
    const user = await connection('users').where({ id: userId }).first();
    if (!user)
      return {
        items: [],
        date: DateTime.now().toISO(),
      };
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
    const contactEntities = due
      .map((row) => mappers.toContactEntity(row))
      .filter((entity) => entity !== undefined);
    return contactEntities;
  },
});

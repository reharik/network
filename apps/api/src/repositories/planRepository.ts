import { Contact, ContactDTO } from '@network/contracts';
import type { Knex } from 'knex';
import { DateTime } from 'luxon';
import type { Mappers } from './mappers';

export interface PlanRepository {
  getDailyPlan: (
    userId: string,
    date?: string,
  ) => Promise<{ items: Contact[]; date: string | null }>;
}

export const createPlanRepository = ({
  connection,
  mappers,
}: {
  connection: Knex;
  mappers: Mappers;
}): PlanRepository => ({
  getDailyPlan: async (userId: string, date?: string) => {
    const user = await connection('users').where({ id: userId }).first();
    if (!user)
      return {
        items: [],
        date: DateTime.now().toISO() || new Date().toISOString(),
      };
    const dayStart = date
      ? DateTime.fromISO(date).startOf('day')
      : DateTime.now().startOf('day');
    const due = await connection<ContactDTO>('contacts')
      .where({ userId, paused: false })
      .andWhere((qb) =>
        qb
          .whereNull('snoozedUntil')
          .orWhere('snoozedUntil', '<=', connection.fn.now()),
      )
      .andWhere('nextDueAt', '<=', dayStart.toJSDate())
      .orderBy([
        { column: 'nextDueAt', order: 'asc' },
        { column: 'updatedAt', order: 'asc' },
        { column: 'fullName', order: 'asc' },
      ])
      .limit(user.dailyGoal);
    if (due.length >= user.dailyGoal) {
      const contactEntities = due
        .map((row) => mappers.toContactEntity(row))
        .filter((entity): entity is Contact => entity !== undefined);
      return { items: contactEntities, date: dayStart.toISO() };
    }
    const topUp = await connection<ContactDTO>('contacts')
      .where({ userId, paused: false })
      .andWhere((qb) =>
        qb
          .whereNull('snoozedUntil')
          .orWhere('snoozedUntil', '<=', connection.fn.now()),
      )
      .andWhere('nextDueAt', '>', dayStart.toJSDate())
      .andWhere('nextDueAt', '<=', dayStart.plus({ days: 3 }).toJSDate())
      .orderBy([
        { column: 'nextDueAt', order: 'asc' },
        { column: 'updatedAt', order: 'asc' },
        { column: 'fullName', order: 'asc' },
      ])
      .limit(user.dailyGoal - due.length);
    const dueEntities = due
      .map((row) => mappers.toContactEntity(row))
      .filter((entity): entity is Contact => entity !== undefined);
    const topUpEntities = topUp
      .map((row) => mappers.toContactEntity(row))
      .filter((entity): entity is Contact => entity !== undefined);
    return {
      items: [...dueEntities, ...topUpEntities],
      date: dayStart.toISO(),
    };
  },
});

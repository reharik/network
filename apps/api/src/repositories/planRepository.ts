import { Contact } from '@network/contracts';
import type { Knex } from 'knex';
import { DateTime } from 'luxon';

export const getDailyPlan = async (db: Knex, userId: string, date?: string) => {
  const user = await db<User>('users').where({ id: userId }).first();
  if (!user) return { items: [], date: DateTime.now().toISO() };

  const dayStart = date
    ? DateTime.fromISO(date).startOf('day')
    : DateTime.now().startOf('day');

  const due = await db<Contact>('contacts')
    .where({ userId, paused: false })
    .andWhere((qb) =>
      qb.whereNull('snoozedUntil').orWhere('snoozedUntil', '<=', db.fn.now()),
    )
    .andWhere('nextDueAt', '<=', dayStart.toJSDate())
    .orderBy([
      { column: 'nextDueAt', order: 'asc' },
      { column: 'updatedAt', order: 'asc' },
      { column: 'fullName', order: 'asc' },
    ])
    .limit(user.dailyGoal);

  if (due.length >= user.dailyGoal) {
    return { items: due, date: dayStart.toISO() };
  }

  const topUp = await db<Contact>('contacts')
    .where({ userId, paused: false })
    .andWhere((qb) =>
      qb.whereNull('snoozedUntil').orWhere('snoozedUntil', '<=', db.fn.now()),
    )
    .andWhere('nextDueAt', '>', dayStart.toJSDate())
    .andWhere('nextDueAt', '<=', dayStart.plus({ days: 3 }).toJSDate())
    .orderBy([
      { column: 'nextDueAt', order: 'asc' },
      { column: 'updatedAt', order: 'asc' },
      { column: 'fullName', order: 'asc' },
    ])
    .limit(user.dailyGoal - due.length);

  return { items: [...due, ...topUp], date: dayStart.toISO() };
};

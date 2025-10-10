import { PlainContact, Touch, UpdateTouch } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import { DatabaseFormat, prepareForDatabase, reviveFromDatabase } from 'smart-enums';
import type { Container } from '../container';

export interface TouchesRepository {
  getTouchedRecordsForDay: (userId: string, dayStart: DateTime<true>) => Promise<Touch[] | []>;
  createTouch: (userId: string, body: UpdateTouch) => Promise<Touch | undefined>;
}

export const createTouchesRepository = ({ connection }: Container): TouchesRepository => ({
  createTouch: async (userId: string, body: UpdateTouch): Promise<Touch | undefined> => {
    const contact = await connection('contacts')
      .where({ id: body.contactId, userId })
      .first<DatabaseFormat<PlainContact>>();
    if (!contact) return undefined;
    const touchData = {
      id: connection.raw('gen_random_uuid()'),
      userId,
      contactId: body.contactId,
      method: body.method,
      message: body.message,
      outcome: body.outcome,
      createdAt: connection.fn.now(),
    };
    const dbTouchData = prepareForDatabase(touchData);
    const [touch] = await connection('touch_logs').insert(dbTouchData).returning('*');
    const intervalDays = typeof contact.intervalDays === 'number' ? contact.intervalDays : 0;
    const nextDueAt = new Date(Date.now() + intervalDays * 86_400_000).toISOString();
    await connection('contacts')
      .where({ id: contact.id })
      .update({ lastTouchedAt: connection.fn.now(), nextDueAt });
    return touch
      ? reviveFromDatabase<Touch>(touch, {
          fieldEnumMapping: {
            method: ['ContactMethod'],
          },
        })
      : undefined;
  },
  getTouchedRecordsForDay: async (userId: string, dayStart: DateTime<true>): Promise<Touch[]> => {
    const touches = await connection('touch_logs')
      .where({ userId })
      .where('createdAt', '>=', dayStart.toJSDate())
      .where('createdAt', '<=', dayStart.endOf('day').toJSDate());
    return touches.length > 0
      ? reviveFromDatabase<Touch[]>(touches, {
          fieldEnumMapping: {
            method: ['ContactMethod'],
          },
        })
      : [];
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createTouchesRepository as any)[RESOLVER] = {};

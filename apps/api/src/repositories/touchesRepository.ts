import type { Knex } from 'knex';
import { TouchDTOPartial } from '@network/contracts';
import type { Mappers } from './mappers';
import type { Touch } from '@network/contracts';

export interface TouchesRepository {
  createTouch: (
    userId: string,
    body: TouchDTOPartial,
  ) => Promise<Touch | undefined>;
}

export const createTouchesRepository = (
  db: Knex,
  mappers: Mappers,
): TouchesRepository => ({
  createTouch: async (userId: string, body: TouchDTOPartial) => {
    const contact = await db('contacts')
      .where({ id: body.contactId, userId })
      .first();
    if (!contact) return undefined;

    const [touch] = await db('touch_logs')
      .insert({
        id: db.raw('gen_random_uuid()'),
        userId,
        contactId: body.contactId,
        method: body.method,
        message: body.message,
        outcome: body.outcome,
        createdAt: db.fn.now(),
      })
      .returning('*');

    const nextDueAt = new Date(
      Date.now() + (contact.intervalDays ?? 0) * 86_400_000,
    ).toISOString();

    await db('contacts')
      .where({ id: contact.id })
      .update({ lastTouchedAt: db.fn.now(), nextDueAt });

    const entity = mappers.toTouchEntity(touch);
    return entity || undefined;
  },
});

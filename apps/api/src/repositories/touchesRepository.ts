import type { Touch } from '@network/contracts';
import { TouchDTOPartial } from '@network/contracts';
import type { Knex } from 'knex';
import type { Mappers } from './mappers';

export interface TouchesRepository {
  createTouch: (userId: string, body: TouchDTOPartial) => Promise<Touch | undefined>;
}

export const createTouchesRepository = ({
  connection,
  mappers,
}: {
  connection: Knex;
  mappers: Mappers;
}): TouchesRepository => ({
  createTouch: async (userId: string, body: TouchDTOPartial) => {
    const contact = await connection('contacts').where({ id: body.contactId, userId }).first();
    if (!contact) return undefined;
    const [touch] = await connection('touch_logs')
      .insert({
        id: connection.raw('gen_random_uuid()'),
        userId,
        contactId: body.contactId,
        method: body.method,
        message: body.message,
        outcome: body.outcome,
        createdAt: connection.fn.now(),
      })
      .returning('*');
    const nextDueAt = new Date(Date.now() + (contact.intervalDays ?? 0) * 86_400_000).toISOString();
    await connection('contacts')
      .where({ id: contact.id })
      .update({ lastTouchedAt: connection.fn.now(), nextDueAt });
    const entity = mappers.toTouchEntity(touch);
    return entity || undefined;
  },
});

import type { Knex } from 'knex';
import { TouchDTOPartial } from './dtos';
import { toTouchEntity } from './mappers';

export const createTouch = async (
  db: Knex,
  userId: string,
  body: TouchDTOPartial,
) => {
  const contact = await db('contacts')
    .where({ id: body.contactId, userId })
    .first();
  if (!contact) return null;

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

  return toTouchEntity(touch);
};

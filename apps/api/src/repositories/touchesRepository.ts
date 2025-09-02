import { ContactMethod } from '@network/contracts';
import type { Knex } from 'knex';

export interface CreateTouchInput {
  contactId: string;
  method: ContactMethod;
  message?: string;
  outcome?: string;
}

export const createTouch = async (
  db: Knex,
  userId: string,
  body: CreateTouchInput,
) => {
  const contact = await db('contacts')
    .where({ id: body.contactId, userId })
    .first();
  if (!contact) return null;

  const [touch] = await db('touchLogs')
    .insert({
      id: db.raw('gen_random_uuid()'),
      userId,
      contactId: body.contactId,
      method: body.method,
      message: body.message ?? null,
      outcome: body.outcome ?? null,
      createdAt: db.fn.now(),
    })
    .returning('*');

  const nextDueAt = new Date(Date.now() + contact.intervalDays * 86_400_000);
  await db('contacts')
    .where({ id: contact.id })
    .update({ lastTouchedAt: new Date(), nextDueAt });

  return touch;
};

import { ContactMethod, TouchDTO, TouchDTOPartial } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { reviveSmartEnums } from 'smart-enums';
import type { Container } from '../container';

export interface TouchesRepository {
  createTouch: (userId: string, body: TouchDTOPartial) => Promise<TouchDTO | undefined>;
}

export const createTouchesRepository = ({ connection }: Container): TouchesRepository => ({
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
    return touch ? reviveSmartEnums<TouchDTO>(touch, { method: ContactMethod }) : undefined;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createTouchesRepository as any)[RESOLVER] = {};

import type { PlainContact, Touch, UpdateTouch } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import { DatabaseFormat, prepareForDatabase, reviveFromDatabase } from 'smart-enums';
import { config } from '../config';
import type { Container } from '../container';
import {
  decryptTouchField,
  encryptTouchField,
  parseEncryptionKey,
} from '../services/touchEncryption';

export interface TouchesRepository {
  getTouchedRecordsForDay: (userId: string, dayStart: DateTime<true>) => Promise<Touch[] | []>;
  getByContactId: (userId: string, contactId: string) => Promise<Touch[]>;
  createTouch: (userId: string, body: UpdateTouch) => Promise<Touch | undefined>;
}

const encryptionKey = parseEncryptionKey(config.touchMessageEncryptionKey);

function decryptTouchRow(row: Record<string, unknown>): void {
  if (!row || !encryptionKey) return;
  if (row.message_enc != null) {
    row.message = decryptTouchField(String(row.message_enc), encryptionKey) ?? row.message;
    delete row.message_enc;
  }
  if (row.subject_enc != null) {
    row.subject = decryptTouchField(String(row.subject_enc), encryptionKey) ?? row.subject;
    delete row.subject_enc;
  }
}

export const createTouchesRepository = ({ connection, logger }: Container): TouchesRepository => ({
  createTouch: async (userId: string, body: UpdateTouch): Promise<Touch | undefined> => {
    try {
      const contact = await connection('contacts')
        .where({ id: body.contactId, userId })
        .first<DatabaseFormat<PlainContact>>();
      if (!contact) {
        logger.warn('Touch creation failed: contact not found', {
          userId,
          contactId: body.contactId,
        });
        return undefined;
      }
      let message: string | null = body.message ?? null;
      let subject: string | null = body.subject ?? null;
      let messageEnc: string | null = null;
      let subjectEnc: string | null = null;
      if (encryptionKey) {
        messageEnc = encryptTouchField(body.message, encryptionKey);
        subjectEnc = encryptTouchField(body.subject, encryptionKey);
        message = null;
        subject = null;
      }
      const touchData = {
        id: connection.raw('gen_random_uuid()'),
        userId,
        contactId: body.contactId,
        method: body.method,
        message,
        subject,
        message_enc: messageEnc,
        subject_enc: subjectEnc,
        outcome: body.outcome,
        fromContactNow: body.fromContactNow ?? false,
        createdAt: connection.fn.now(),
      };
      const dbTouchData = prepareForDatabase(touchData);
      const [touch] = await connection('touch_logs').insert(dbTouchData).returning('*');
      const intervalDays = typeof contact.intervalDays === 'number' ? contact.intervalDays : 0;
      const nextDueAt = new Date(Date.now() + intervalDays * 86_400_000).toISOString();
      await connection('contacts')
        .where({ id: contact.id })
        .update({ lastTouchedAt: connection.fn.now(), nextDueAt });
      if (touch && typeof touch === 'object') decryptTouchRow(touch as Record<string, unknown>);
      const result = touch
        ? reviveFromDatabase<Touch>(touch, {
            fieldEnumMapping: {
              method: ['ContactMethod'],
            },
          })
        : undefined;
      if (result) {
        logger.info('Touch created', {
          userId,
          touchId: result.id,
          contactId: body.contactId,
          method: body.method,
          outcome: body.outcome,
        });
      }
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Failed to create touch', err, {
        userId,
        contactId: body.contactId,
      });
      throw error;
    }
  },
  getTouchedRecordsForDay: async (userId: string, dayStart: DateTime<true>): Promise<Touch[]> => {
    const rows = await connection('touch_logs')
      .where({ userId })
      .where('createdAt', '>=', dayStart.toJSDate())
      .where('createdAt', '<=', dayStart.endOf('day').toJSDate());
    rows.forEach((row) => decryptTouchRow(row as Record<string, unknown>));
    return rows.length > 0
      ? reviveFromDatabase<Touch[]>(rows, {
          fieldEnumMapping: {
            method: ['ContactMethod'],
          },
        })
      : [];
  },

  getByContactId: async (userId: string, contactId: string): Promise<Touch[]> => {
    const rows = await connection('touch_logs')
      .where({ userId, contactId })
      .orderBy('createdAt', 'desc');
    rows.forEach((row) => decryptTouchRow(row as Record<string, unknown>));
    return rows.length > 0
      ? reviveFromDatabase<Touch[]>(rows, {
          fieldEnumMapping: {
            method: ['ContactMethod'],
          },
        })
      : [];
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createTouchesRepository as any)[RESOLVER] = {};

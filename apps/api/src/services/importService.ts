import { ContactMethod } from '@network/contracts';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

export interface ImportRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string | string[];
}

export interface ImportResult {
  inserted: number;
  skipped: number;
}

export interface ImportService {
  importContacts: (userId: string, rows: ImportRow[]) => Promise<ImportResult>;
}

export const createImportService = ({ contactRepository, logger }: Container): ImportService => ({
  importContacts: async (userId: string, rows: ImportRow[]): Promise<ImportResult> => {
    let inserted = 0;
    let skipped = 0;

    for (const row of rows) {
      // Skip rows without required fields
      if (!row.firstName || !row.lastName) {
        skipped++;
        continue;
      }

      try {
        // Parse tags if provided
        // const tags = Array.isArray(row.tags)
        //   ? row.tags
        //   : typeof row.tags === 'string'
        //     ? row.tags
        //         .split('|')
        //         .map((s) => s.trim())
        //         .filter(Boolean)
        //     : [];

        // Create contact with default values
        const contactData = {
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email || undefined,
          phone: row.phone || undefined,
          notes: row.notes || undefined,
          preferredMethod: ContactMethod.EMAIL, // Default to email
          suggestion: "Hi {{firstName}}, just checking in to see how you're doing.".replaceAll(
            '{{firstName}}',
            row.firstName,
          ),
          intervalDays: 30, // Default interval
          paused: false,
        };

        await contactRepository.createContact(userId, contactData);
        inserted++;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('Error importing contact', err, {
          userId,
          contactData: {
            firstName: row.firstName,
            lastName: row.lastName,
            hasEmail: !!row.email,
            hasPhone: !!row.phone,
          },
        });
        skipped++;
      }
    }

    return { inserted, skipped };
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createImportService as any)[RESOLVER] = {};

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
      // Skip rows with neither first nor last name (require at least one)
      const first = row.firstName?.trim() ?? '';
      const last = row.lastName?.trim() ?? '';
      if (!first && !last) {
        skipped++;
        continue;
      }

      // Use provided name(s); if only one is set, use it for both (Contact requires both non-empty)
      const firstName = first || last;
      const lastName = last || first;

      try {
        // Create contact with default values
        const contactData = {
          firstName,
          lastName,
          email: row.email || undefined,
          phone: row.phone || undefined,
          notes: row.notes || undefined,
          preferredMethod: ContactMethod.EMAIL, // Default to email
          suggestion: "Hi {{firstName}}, just checking in to see how you're doing.".replaceAll(
            '{{firstName}}',
            firstName,
          ),
          intervalDays: 14, // Default interval (matches database default)
          paused: false,
        };

        await contactRepository.createContact(userId, contactData);
        inserted++;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logger.error('Error importing contact', err, {
          userId,
          contactData: {
            firstName,
            lastName,
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

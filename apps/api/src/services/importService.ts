import { ContactMethod } from '@network/contracts';
import { RESOLVER } from 'awilix';
import type { Container } from '../container';

/**
 * Normalize a name field for display: title-case real names, lowercase if it looks like an email.
 */
const normalizeNamePart = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes('@')) return trimmed.toLowerCase();
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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
      const rawFirst = row.firstName?.trim() ?? '';
      const rawLast = row.lastName?.trim() ?? '';
      if (!rawFirst && !rawLast) {
        skipped++;
        continue;
      }

      // Capitalize names (title-case); if value looks like email, use lowercase
      const firstName = rawFirst ? normalizeNamePart(rawFirst) : '';
      const lastName = rawLast ? normalizeNamePart(rawLast) : '';

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
            firstName || lastName || 'there',
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

import { ContactMethod } from '@network/contracts';
import type { ContactRepository } from '../repositories/contactRepository';

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

export const createImportService = ({
  contactRepository,
}: {
  contactRepository: ContactRepository;
}): ImportService => ({
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
          preferredMethod: ContactMethod.email.value, // Default to email
          suggestion: "Hi {{firstName}}, just checking in to see how you're doing.",
          intervalDays: 30, // Default interval
          paused: false,
        };

        await contactRepository.createContact(userId, contactData);
        inserted++;
      } catch (error) {
        console.error('Error importing contact:', error);
        skipped++;
      }
    }

    return { inserted, skipped };
  },
});

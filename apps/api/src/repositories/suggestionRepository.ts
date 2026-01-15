import type { Knex } from 'knex';

export interface SuggestionRepository {
  getSuggestionsForContact: (contact: { fullName: string }) => Promise<string[]>;
}

export const createSuggestionRepository = ({
  connection,
}: {
  connection: Knex;
}): SuggestionRepository => ({
  getSuggestionsForContact: async (contact: { fullName: string }) => {
    const firstName = contact.fullName.split(' ')[0];
    const rows = await connection<{ body: string }>('suggestionTemplates')
      .select('body')
      .orderBy('createdAt', 'asc')
      .limit(10);
    const pool = rows.length
      ? rows.map((r) => r.body)
      : [
          "Hi {{firstName}}, just checking in to see how you're doing.",
          "Hey {{firstName}} — thought of you today. How's your week going?",
          'Hi {{firstName}}! Anything new or fun lately? Would love to catch up.',
        ];
    const picks: string[] = [];
    for (const s of pool) {
      const msg = s.replaceAll('{{firstName}}', firstName);
      if (!picks.includes(msg)) picks.push(msg);
      if (picks.length >= 3) break;
    }
    return picks;
  },
});

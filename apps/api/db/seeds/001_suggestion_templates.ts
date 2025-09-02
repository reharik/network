import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('suggestion_templates').del();
  await knex('suggestion_templates').insert([
    {
      language: 'en',
      body: 'Hi {{firstName}}, just checking in to see how you’re doing.',
    },
    {
      language: 'en',
      body: 'Hey {{firstName}} — thought of you today. How’s your week going?',
    },
    {
      language: 'en',
      body: 'Hi {{firstName}}! Anything new or fun lately? Would love to catch up.',
    },
    {
      language: 'en',
      body: 'Thinking of you, {{firstName}}. Want to grab a quick coffee/chat this week?',
    },
  ]);
}

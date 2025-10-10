import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing test contacts (only the ones we're about to create)
  await knex('contacts')
    .whereIn('id', [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333',
      '44444444-4444-4444-4444-444444444444',
    ])
    .del();

  const now = new Date();
  // Use UTC to match the query timezone for consistent date handling
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  // Insert test contacts
  await knex('contacts').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      userId: '550e8400-e29b-41d4-a716-446655440001', // John Doe
      firstName: 'Alice',
      lastName: 'Johnson',
      preferredMethod: 'EMAIL',
      email: 'alice.johnson@example.com',
      phone: undefined,
      notes: undefined,
      suggestion: "Hey {{firstName}}, hope you're doing well! Let's catch up soon.",
      intervalDays: 7,
      lastTouchedAt: undefined,
      nextDueAt: today, // Due today!
      snoozedUntil: undefined,
      paused: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      userId: '550e8400-e29b-41d4-a716-446655440001', // John Doe
      firstName: 'Bob',
      lastName: 'Wilson',
      preferredMethod: 'SMS',
      email: undefined,
      phone: '+1-555-123-4567',
      notes: 'Prefers text messages',
      suggestion: 'Hi {{firstName}}, just wanted to check in and see how things are going!',
      intervalDays: 14,
      lastTouchedAt: undefined,
      nextDueAt: today, // Due today!
      snoozedUntil: undefined,
      paused: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      userId: '550e8400-e29b-41d4-a716-446655440001', // John Doe
      firstName: 'Carol',
      lastName: 'Davis',
      preferredMethod: 'CALL',
      email: 'carol.davis@example.com',
      phone: '+1-555-987-6543',
      notes: 'Prefers phone calls in the evening',
      suggestion: "Hello {{firstName}}, it's been a while! Would love to hear how you're doing.",
      intervalDays: 30,
      lastTouchedAt: undefined,
      nextDueAt: today, // Due today!
      snoozedUntil: undefined,
      paused: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      userId: '550e8400-e29b-41d4-a716-446655440001', // John Doe
      firstName: 'David',
      lastName: 'Brown',
      preferredMethod: 'EMAIL',
      email: 'david.brown@example.com',
      phone: undefined,
      notes: undefined,
      suggestion: 'Hi {{firstName}}, hope all is well with you!',
      intervalDays: 7,
      lastTouchedAt: undefined,
      nextDueAt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      snoozedUntil: undefined,
      paused: false,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Insert test users
  await knex('users').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      passwordHash: hashedPassword,
      dailyGoal: 5,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      passwordHash: hashedPassword,
      dailyGoal: 3,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: hashedPassword,
      dailyGoal: 2,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
    },
  ]);
}

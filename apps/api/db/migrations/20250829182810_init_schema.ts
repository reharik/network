// db/migrations/20250830_init.ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // users
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email', 320).notNullable().unique();
    t.integer('dailyGoal').notNullable().defaultTo(3);
    t.timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updatedAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  // contacts
  await knex.schema.createTable('contacts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    t.uuid('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // ✅ split name
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();

    // ✅ keep enum as TEXT with a constraint (no native enum)
    t.enu('preferredMethod', ['EMAIL', 'SMS', 'CALL', 'OTHER'])
      .notNullable()
      .defaultTo('EMAIL');

    t.string('email', 320);
    // ✅ rename phoneE164 -> phone (you can still store E.164 formatted values)
    t.string('phone', 32);
    t.text('notes');

    t.integer('intervalDays').notNullable().defaultTo(14);
    t.timestamp('lastTouchedAt', { useTz: true });
    t.timestamp('nextDueAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('snoozedUntil', { useTz: true });
    t.boolean('paused').notNullable().defaultTo(false);

    t.timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    t.timestamp('updatedAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    // helpful indexes
    t.index(['userId', 'nextDueAt']);
    t.index(['userId', 'lastName', 'firstName']);
  });

  // touch_logs
  await knex.schema.createTable('touch_logs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    t.uuid('contactId')
      .notNullable()
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE');

    // enum-as-string via CHECK constraint
    t.enu('method', ['EMAIL', 'SMS', 'CALL', 'OTHER']).notNullable();

    t.text('message');
    t.text('outcome');

    t.timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  // suggestion_templates
  await knex.schema.createTable('suggestion_templates', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('language', 8).notNullable().defaultTo('en');
    t.text('body').notNullable();
    t.timestamp('createdAt', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('suggestion_templates');
  await knex.schema.dropTableIfExists('touch_logs');
  await knex.schema.dropTableIfExists('contacts');
  await knex.schema.dropTableIfExists('users');
}

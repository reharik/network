import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.text('defaultContactMessage').nullable();
    table.integer('defaultIntervalDays').nullable();
    table.string('defaultPreferredMethod', 32).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('defaultContactMessage');
    table.dropColumn('defaultIntervalDays');
    table.dropColumn('defaultPreferredMethod');
  });
}

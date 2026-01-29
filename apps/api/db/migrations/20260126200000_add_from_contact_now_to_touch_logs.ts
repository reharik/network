import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('touch_logs', (t) => {
    t.boolean('fromContactNow').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('touch_logs', (t) => {
    t.dropColumn('fromContactNow');
  });
}

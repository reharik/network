import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('touch_logs', (t) => {
    t.text('subject');
    t.text('message_enc');
    t.text('subject_enc');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('touch_logs', (t) => {
    t.dropColumn('subject');
    t.dropColumn('message_enc');
    t.dropColumn('subject_enc');
  });
}

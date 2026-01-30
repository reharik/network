import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contact_emails', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('contactId').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    t.string('email', 320).notNullable();
    t.boolean('isDefault').notNullable().defaultTo(false);
    t.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['contactId']);
  });

  await knex.schema.createTable('contact_phones', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('contactId').notNullable().references('id').inTable('contacts').onDelete('CASCADE');
    t.string('phone', 32).notNullable();
    t.boolean('isDefault').notNullable().defaultTo(false);
    t.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['contactId']);
  });

  // Migrate existing single email/phone into new tables
  const contactsWithEmail = await knex('contacts').select('id', 'email').whereNotNull('email');
  for (const row of contactsWithEmail) {
    await knex('contact_emails').insert({
      contactId: row.id,
      email: row.email,
      isDefault: true,
    });
  }

  const contactsWithPhone = await knex('contacts').select('id', 'phone').whereNotNull('phone');
  for (const row of contactsWithPhone) {
    await knex('contact_phones').insert({
      contactId: row.id,
      phone: row.phone,
      isDefault: true,
    });
  }

  await knex.schema.alterTable('contacts', (t) => {
    t.dropColumn('email');
    t.dropColumn('phone');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contacts', (t) => {
    t.string('email', 320);
    t.string('phone', 32);
  });

  const contacts = await knex('contacts').select('id');
  for (const c of contacts) {
    const defaultEmail = await knex('contact_emails')
      .where({ contactId: c.id, isDefault: true })
      .first();
    const anyEmail = await knex('contact_emails').where({ contactId: c.id }).first();
    const email = defaultEmail?.email ?? anyEmail?.email;
    const defaultPhone = await knex('contact_phones')
      .where({ contactId: c.id, isDefault: true })
      .first();
    const anyPhone = await knex('contact_phones').where({ contactId: c.id }).first();
    const phone = defaultPhone?.phone ?? anyPhone?.phone;
    if (email != null || phone != null) {
      await knex('contacts')
        .where({ id: c.id })
        .update({ email: email ?? null, phone: phone ?? null });
    }
  }

  await knex.schema.dropTableIfExists('contact_phones');
  await knex.schema.dropTableIfExists('contact_emails');
}

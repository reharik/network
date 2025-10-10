import type { PlainContact, PlainTouch, PlainUser } from '@network/contracts';
import type { DatabaseFormat } from 'smart-enums';

declare module 'knex/types/tables' {
  interface Tables {
    contacts: DatabaseFormat<PlainContact>;
    touch_logs: DatabaseFormat<PlainTouch>;
    users: PlainUser;
  }
}

// Extend Knex QueryBuilder to accept prepareForDatabase output
declare module 'knex' {
  namespace Knex {
    interface QueryBuilder<TRecord, TResult> {
      insert(record: unknown): QueryBuilder<TRecord, TResult>;
      update(record: unknown): QueryBuilder<TRecord, TResult>;
    }
  }
}

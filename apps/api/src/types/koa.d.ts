import 'koa';
import type { Knex } from 'knex';

declare module 'koa' {
  interface DefaultContext {
    db: Knex;
  }
}

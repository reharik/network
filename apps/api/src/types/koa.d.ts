import 'koa';
import type { Knex } from 'knex';
import { User } from '@network/contracts';

declare module 'koa' {
  interface DefaultContext {
    db: Knex;
    user: User;
  }
}

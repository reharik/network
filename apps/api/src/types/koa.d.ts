import { User } from '@network/contracts';
import type { Knex } from 'knex';
import 'koa';

declare module 'koa' {
  interface DefaultContext {
    db: Knex;
    user: User;
    isLoggedIn: boolean;
  }
}

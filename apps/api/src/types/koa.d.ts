import type { User } from '@network/contracts';
import type { Knex } from 'knex';
import 'koa';
import type { Context } from 'koa';

declare module 'koa' {
  interface DefaultContext {
    db: Knex;
    user: User;
    isLoggedIn: boolean;
  }
}

// Extend the base Context to include params
declare module 'koa' {
  interface DefaultContext {
    params: Record<string, string>;
  }
}

// Generic typed context helper for controllers
export type TypedContext<T extends Record<string, string> = {}> = Context & {
  params: T;
};

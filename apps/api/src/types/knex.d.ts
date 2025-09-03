// types/knex.d.ts

import { User } from '@network/contracts';
import { ContactDB, TouchDB } from '../repositories/dtos';

declare module 'knex/types/tables' {
  interface Tables {
    contacts: ContactDB;
    touch_logs: TouchDB;
    users: User;
  }
}

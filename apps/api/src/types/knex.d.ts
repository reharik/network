// types/knex.d.ts

import type { Knex } from 'knex';
import type { ContactDTO, TouchDTO, User } from '@network/contracts';

declare module 'knex/types/tables' {
  interface Tables {
    contacts: ContactDTO;
    touch_logs: TouchDTO;
    users: User;
  }
}

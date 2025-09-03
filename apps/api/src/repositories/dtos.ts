import { Contact, ReplaceProp, Touch } from '@network/contracts';

export type ContactDTOPartial = ReplaceProp<
  Partial<Contact>,
  'preferredMethod',
  string
>;

export type ContactDB = ReplaceProp<Contact, 'preferredMethod', string, false>;

export type TouchDTOPartial = ReplaceProp<Partial<Touch>, 'method', string>;

export type TouchDB = ReplaceProp<Touch, 'method', string, false>;

import { DateTime } from 'luxon';
import { enumeration, Enumeration } from 'smart-enums';

const input = {
  everyWeek: {
    value: 'everyWeek',
    eligible: (lastContacted: DateTime) => lastContacted > DateTime.now().plus({ weeks: 1 }),
  },
  every2Week: {
    value: 'every2Week',
    eligible: (lastContacted: DateTime) => lastContacted > DateTime.now().plus({ weeks: 2 }),
  },
  every3Week: {
    value: 'every3Week',
    eligible: (lastContacted: DateTime) => lastContacted > DateTime.now().plus({ weeks: 3 }),
  },
  everyMonth: {
    value: 'everyMonth',
    eligible: (lastContacted: DateTime) => lastContacted > DateTime.now().plus({ months: 1 }),
  },
  every6Weeks: {
    value: 'every6Weeks',
    eligible: (lastContacted: DateTime) => lastContacted > DateTime.now().plus({ weeks: 6 }),
  },
};

export type Frequency = Enumeration<typeof Frequency>;
export const Frequency = enumeration<
  typeof input,
  { eligible: (lastContacted: DateTime) => boolean }
>({
  input,
});

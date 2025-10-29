import { enumeration, Enumeration } from 'smart-enums';

type Contactable = { email?: string; sms?: string; call?: string; other?: string };

type ContactMethodItem = {
  link: (handle: Contactable) => string;
  handle: (handle: Contactable) => string;
};

const input = {
  email: {
    link: (contactable: Contactable) => `mailto:${contactable.email}`,
    handle: (contactable: Contactable) => contactable.email,
  },
  sms: {
    link: (contactable: Contactable) => `sms:${contactable.sms}`,
    handle: (contactable: Contactable) => contactable.sms,
  },
  call: {
    link: (contactable: Contactable) => `tel:${contactable.call}`,
    handle: (contactable: Contactable) => contactable.call,
  },
  other: { link: () => '#', handle: () => '' },
};

export const ContactMethod = enumeration<typeof input, ContactMethodItem>('ContactMethod', {
  input,
});
export type ContactMethod = Enumeration<typeof ContactMethod>;

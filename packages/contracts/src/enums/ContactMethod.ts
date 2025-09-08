import { enumeration, Enumeration } from 'smart-enums';

const input = ['email', 'sms', 'call', 'other'] as const;
export const ContactMethod = enumeration({
  input,
});

export type ContactMethod = Enumeration<typeof ContactMethod, typeof ContactMethod>;

export const parseContactMethod = (s: string): ContactMethod | undefined =>
  ContactMethod.tryFromValue(s) ?? ContactMethod.tryFromKey(s) ?? ContactMethod.tryFromDisplay(s);

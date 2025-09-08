import { ContactMethod } from '@network/contracts';

export type Contact = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  preferredMethod: 'EMAIL' | 'SMS' | 'CALL' | 'OTHER';
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  intervalDays: number;
  paused?: boolean;
  snoozedUntil?: string | null;
  nextDueAt?: string;
  lastTouchedAt?: string | null;
};

// API response types
export type DailyPlanBE = {
  date: string;
  items: Contact[];
};

export type TodayPickFE = {
  id: string;
  userId: string;
  name: string;
  preferredChannel: ContactMethod;
  handle?: string;
  intervalDays: number;
  link: string;
  suggestion: string;
};

export type TodayResponseFE = {
  date: string;
  picks: TodayPickFE[];
};

// Helper function to convert backend contact to frontend contact
export const toFEContact = (contact: Contact): Omit<TodayPickFE, 'link' | 'suggestion'> => {
  const preferredChannel = ContactMethod.fromValue(contact.preferredMethod);
  const handle =
    preferredChannel === ContactMethod.email
      ? contact.email
      : preferredChannel === ContactMethod.sms || preferredChannel === ContactMethod.call
        ? contact.phone
        : undefined;

  return {
    id: contact.id,
    userId: contact.userId,
    name: `${contact.firstName} ${contact.lastName}`,
    preferredChannel,
    handle: handle || undefined,
    intervalDays: contact.intervalDays,
  };
};

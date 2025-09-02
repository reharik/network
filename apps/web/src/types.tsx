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

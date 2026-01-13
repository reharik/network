import { Contact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import type { Container } from '../container';

// Contact with daily plan status
type DailyContact = Contact & { touchedToday: boolean };

export interface PlanService {
  getDailyPlan: (userId: string) => Promise<DailyContact[]>;
}

export const createPlanService = ({
  userRepository,
  planRepository,
  touchesRepository,
  contactRepository,
}: Container): PlanService => ({
  getDailyPlan: async (userId: string) => {
    const user = await userRepository.getUser(userId);
    if (!user) return [];

    const dayStart = DateTime.now().startOf('day');

    // Get touches for today to find which contacts are already done
    const todaysTouches = await touchesRepository.getTouchedRecordsForDay(userId, dayStart);
    const touchedContactIds = new Set(todaysTouches.map((t) => t.contactId));

    // Get due contacts (up to dailyGoal - already touched count)
    const remainingGoal = Math.max(0, user.dailyGoal - touchedContactIds.size);
    const dueContacts = await planRepository.getDailyContacts(userId, dayStart, remainingGoal);

    // Touched contacts are no longer "due" (nextDueAt was updated when touch was logged)
    // so we need to fetch them separately to include them in today's list
    const touchedContacts = await Promise.all(
      [...touchedContactIds].map((id) => contactRepository.getContact(userId, id)),
    );

    // Build result: due contacts + touched contacts, with touchedToday flag
    const result: DailyContact[] = [];

    // Add due contacts (not already touched today)
    for (const contact of dueContacts) {
      if (!touchedContactIds.has(contact.id)) {
        result.push({ ...contact, touchedToday: false });
      }
    }

    // Add contacts touched today (these are "done" but should still show)
    for (const contact of touchedContacts) {
      if (contact) {
        result.push({ ...contact, touchedToday: true });
      }
    }

    // Sort by touchedToday (done last), then by nextDueAt
    result.sort((a, b) => {
      if (a.touchedToday !== b.touchedToday) {
        return a.touchedToday ? 1 : -1; // Done contacts at the end
      }
      // Both same status, sort by lastName
      return (a.lastName ?? '').localeCompare(b.lastName ?? '');
    });

    return result;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanService as any)[RESOLVER] = {};

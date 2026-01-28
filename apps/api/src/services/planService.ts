import { Contact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import type { Container } from '../container';

// Contact with daily plan status
type DailyContact = Contact & { touchedToday: boolean };

// Simple hash function for consistent randomization based on seed
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

export interface PlanService {
  getDailyPlan: (userId: string) => Promise<DailyContact[]>;
}

export const createPlanService = ({ userRepository, planRepository }: Container): PlanService => ({
  getDailyPlan: async (userId: string) => {
    const user = await userRepository.getUser(userId);
    if (!user) return [];

    const dayStart = DateTime.now().startOf('day');

    // Touched today, excluding suspended — filter done at query level in plan repository
    const touchedContacts = await planRepository.getTouchedContactsForDay(userId, dayStart);
    const touchedContactIds = new Set(touchedContacts.map((c) => c.id));

    // Get due contacts (up to dailyGoal - already touched count)
    // The repository will prioritize overdue contacts (nextDueAt < today) as carryovers
    // These are contacts that were due before today and weren't completed
    const remainingGoal = Math.max(0, user.dailyGoal - touchedContactIds.size);

    // Fetch all due contacts to identify carryovers (overdue contacts)
    // We'll pass overdue contact IDs to ensure they're prioritized
    const allDueForCarryoverCheck = await planRepository.getDailyContacts(
      userId,
      dayStart,
      user.dailyGoal * 10, // Fetch many to identify all carryovers
      [],
    );

    // Identify carryover contacts: overdue (nextDueAt < today)
    // These are guaranteed to be contacts that were due before and weren't completed
    const carryoverContactIds = allDueForCarryoverCheck
      .filter((c) => {
        if (!c.nextDueAt) return false;
        const nextDue = DateTime.fromISO(c.nextDueAt);
        return nextDue < dayStart; // Overdue = definitely a carryover
      })
      .map((c) => c.id);

    // Get due contacts with carryovers prioritized (suspend filter in repository query)
    const dueContacts = await planRepository.getDailyContacts(
      userId,
      dayStart,
      remainingGoal,
      carryoverContactIds,
    );

    // Build result: due contacts + touched contacts, with touchedToday flag
    const result: DailyContact[] = [];

    // Add due contacts (not already touched today)
    for (const contact of dueContacts) {
      if (!touchedContactIds.has(contact.id)) {
        result.push({ ...contact, touchedToday: false });
      }
    }

    // Add contacts touched today (suspended already excluded by getTouchedContactsForDay)
    for (const contact of touchedContacts) {
      result.push({ ...contact, touchedToday: true });
    }

    // Sort by touchedToday (done last), then randomize within each group
    result.sort((a, b) => {
      if (a.touchedToday !== b.touchedToday) {
        return a.touchedToday ? 1 : -1; // Done contacts at the end
      }
      // Both same status, randomize using a seeded random based on date
      // This gives consistent ordering throughout the day but changes daily
      const seed = dayStart.toISODate() ?? '';
      const hashA = simpleHash(a.id + seed);
      const hashB = simpleHash(b.id + seed);
      return hashA - hashB;
    });

    return result;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanService as any)[RESOLVER] = {};

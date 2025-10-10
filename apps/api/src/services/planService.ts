import { Contact } from '@network/contracts';
import { RESOLVER } from 'awilix';
import { DateTime } from 'luxon';
import type { Container } from '../container';

export interface PlanService {
  getDailyPlan: (userId: string) => Promise<Contact[]>;
}

export const createPlanService = ({
  userRepository,
  planRepository,
  touchesRepository,
}: Container): PlanService => ({
  getDailyPlan: async (userId: string) => {
    const user = await userRepository.getUser(userId);
    if (!user) return [];
    const dayStart = DateTime.now().startOf('day');
    const completedContacts = await touchesRepository.getTouchedRecordsForDay(userId, dayStart);
    const goal = user.dailyGoal - completedContacts.length;
    const contacts = await planRepository.getDailyContacts(userId, dayStart, goal);
    return contacts;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createPlanService as any)[RESOLVER] = {};

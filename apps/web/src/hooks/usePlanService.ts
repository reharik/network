import { ContactMethod } from '@network/contracts';
import { DailyPlanBE, TodayPickFE, TodayResponseFE, toFEContact } from '../types';
import { useApiFetch } from './useApiFetch';

export const usePlanService = () => {
  const { apiFetch } = useApiFetch();

  const buildLink = (ch: ContactMethod, handle: string) => {
    if (!handle) return '#';
    if (ch === ContactMethod.email) return `mailto:${encodeURIComponent(handle)}`;
    if (ch === ContactMethod.call) return `tel:${handle}`;
    if (ch === ContactMethod.sms) return `sms:${handle}`;
    return '#';
  };

  const getTodayReachOuts = async (count = 3): Promise<TodayResponseFE> => {
    const plan = await apiFetch<DailyPlanBE>(`/plan`);
    const items = plan.items.slice(0, count);

    // parallel suggestions requests; take first suggestion or default
    const suggestions = await Promise.all(
      items.map((c) =>
        apiFetch<string[]>(`/contacts/${encodeURIComponent(c.id)}/suggestions`)
          .then((arr) => arr[0] ?? 'Hi — just checking in!')
          .catch(() => 'Hi — just checking in!'),
      ),
    );

    const picks: TodayPickFE[] = items.map((c, i) => {
      const fe = toFEContact(c);
      return {
        ...fe,
        link: buildLink(fe.preferredChannel, fe.handle || ''),
        suggestion: suggestions[i],
      };
    });

    return { date: plan.date, picks };
  };

  return {
    getTodayReachOuts,
  };
};

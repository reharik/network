import { Contact, ContactDTO } from '@network/contracts';
import { mappers } from '../mappers';
import { useApiFetch } from './useApiFetch';

export const usePlanService = () => {
  const { apiFetch } = useApiFetch();

  const getTodaysContacts = async (): Promise<Contact[]> => {
    const contacts = await apiFetch<ContactDTO[]>(`/plan`);
    return contacts.map((x) => mappers.toContact(x)).filter((x) => !!x);
  };

  return {
    getTodaysContacts,
  };
};

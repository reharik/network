export const qk = {
  contacts: ['contacts'] as const,
  contact: (id: string) => ['contact', id] as const,
};

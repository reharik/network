import type { User } from '@network/contracts';

/**
 * Sanitizes a user object by removing sensitive fields like passwordHash
 * before sending to the client
 */
export const sanitizeUser = (user: User): Omit<User, 'passwordHash'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

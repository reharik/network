/**
 * Generic token replacement function.
 * Replaces {{propertyName}} tokens with corresponding values from the data object.
 * @throws Error if a token references a property that doesn't exist in the data object
 */
export const replaceTokens = <T extends object>(text: string, data: T): string => {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (!(key in data)) {
      throw new Error(
        `Token "{{${key}}}" not found in data object. Available keys: ${Object.keys(data).join(', ')}`,
      );
    }
    const value = (data as Record<string, unknown>)[key];
    return value != null ? String(value) : '';
  });
};

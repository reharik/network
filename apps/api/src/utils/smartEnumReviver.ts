import { ContactMethod } from '@network/contracts';

// Registry for smart enum revival - this should match the enumType values
const smartEnumRegistry = {
  ContactMethod,
} as const;

// JSON reviver function for smart enum revival
export function createSmartEnumReviver() {
  return (key: string, value: unknown) => {
    if (value && typeof value === 'object' && '__smart_enum_type' in value && 'value' in value) {
      const { __smart_enum_type, value: enumValue } = value as {
        __smart_enum_type: keyof typeof smartEnumRegistry;
        value: string;
      };
      const enumObject = smartEnumRegistry[__smart_enum_type];
      if (enumObject) {
        return enumObject.tryFromValue(enumValue) ?? value;
      }
    }
    return value;
  };
}

// This should be used in the API layer for JSON parsing
export const smartEnumReviver = createSmartEnumReviver();

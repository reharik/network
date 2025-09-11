import { ContactMethod } from '../enums/ContactMethod';
// Smart enum registry for both frontend and backend
export const smartEnumRegistry = {
    ContactMethod: ContactMethod,
    // Add other smart enum types here as they are created
};
// Generic reviver function for smart enums
export const createSmartEnumReviver = (registry) => {
    return (key, value) => {
        if (value && typeof value === 'object' && '__smart_enum_type' in value && 'value' in value) {
            const { __smart_enum_type, value: v } = value;
            const enumClass = registry[__smart_enum_type];
            return enumClass?.tryFromValue(v) ?? value;
        }
        return value;
    };
};

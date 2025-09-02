import { enumeration } from 'smart-enums';
const input = ['email', 'sms', 'call', 'other'];
export const ContactMethod = enumeration({
    input,
});
export const parseContactMethod = (s) => ContactMethod.tryFromValue(s) ??
    ContactMethod.tryFromKey(s) ??
    ContactMethod.tryFromDisplay(s);

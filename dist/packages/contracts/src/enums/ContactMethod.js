import { enumeration } from 'smart-enums';
const input = {
    email: {
        link: (contactable) => `mailto:${contactable.email}`,
        handle: (contactable) => contactable.email,
    },
    sms: {
        link: (contactable) => `sms:${contactable.sms}`,
        handle: (contactable) => contactable.sms,
    },
    call: {
        link: (contactable) => `tel:${contactable.call}`,
        handle: (contactable) => contactable.call,
    },
    other: { link: () => '#', handle: () => '' },
};
export const ContactMethod = enumeration({
    input,
});

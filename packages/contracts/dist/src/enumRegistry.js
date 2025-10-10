import * as Enums from './enums';
export const enumRegistry = Object.entries(Enums).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
}, {});

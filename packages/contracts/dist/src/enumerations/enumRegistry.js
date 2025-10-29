import { isSmartEnum } from 'smart-enums';
import * as Enums from './enums/index';
export const enumRegistry = Object.entries(Enums).reduce((acc, [key, value]) => {
    if (isSmartEnum(value)) {
        acc[key] = value;
    }
    return acc;
}, {});

export type EnumRegistry = Record<string, AnyEnumLike>;

import { AnyEnumLike } from 'smart-enums';
import * as Enums from './enums';

export const enumRegistry: EnumRegistry = Object.entries(Enums).reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {} as EnumRegistry);

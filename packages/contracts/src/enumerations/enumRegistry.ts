import { AnyEnumLike, isSmartEnum } from 'smart-enums';
import * as Enums from './enums/index';

export type EnumRegistry = Record<string, AnyEnumLike>;

export const enumRegistry: EnumRegistry = Object.entries(Enums).reduce((acc, [key, value]) => {
  if (isSmartEnum(value)) {
    acc[key] = value;
  }
  return acc;
}, {} as EnumRegistry);

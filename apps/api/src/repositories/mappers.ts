import { Contact, Touch } from '@network/contracts';
import { ContactMethod } from '@network/contracts';
import type {
  ContactDB,
  ContactDTOPartial,
  TouchDB,
  TouchDTOPartial,
} from './dtos';

export const toContactDTOPartial = (entity: Contact): ContactDTOPartial => {
  return { ...entity, preferredMethod: entity.preferredMethod.value };
};

export const toContactEntity = (dto?: ContactDB): Contact | undefined => {
  return dto
    ? {
        ...dto,
        preferredMethod: ContactMethod.fromValue(dto.preferredMethod),
      }
    : undefined;
};

export const toTouchDTO = (entity: Touch): TouchDTOPartial => {
  return { ...entity, method: entity.method.value };
};

export const toTouchEntity = (dto: TouchDB): Touch | undefined => {
  return dto
    ? {
        ...dto,
        method: ContactMethod.fromValue(dto.method),
      }
    : undefined;
};

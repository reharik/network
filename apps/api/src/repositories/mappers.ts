import type {
  ContactDTO,
  ContactDTOPartial,
  ContactListDTO,
  TouchDTO,
  TouchDTOPartial,
} from '@network/contracts';
import { Contact, ContactMethod, Touch } from '@network/contracts';

export interface Mappers {
  // Database to Entity (internal use)
  toContactEntity: (dto?: ContactDTO) => Contact | undefined;
  toTouchEntity: (dto: TouchDTO) => Touch | undefined;

  // Entity to DTO (for API responses)
  toContactDTO: (entity: Contact) => ContactDTO;
  toTouchDTO: (entity: Touch) => TouchDTO;
  toContactListDTO: (entities: Contact[]) => ContactListDTO;

  // DTO to Entity (for API requests)
  toContactDTOPartial: (entity: Contact) => ContactDTOPartial;
  toTouchDTOPartial: (entity: Touch) => TouchDTOPartial;
}

export const createMappers = (): Mappers => ({
  // Database to Entity (internal use)
  toContactEntity: (dto?: ContactDTO): Contact | undefined => {
    return dto
      ? {
          ...dto,
          preferredMethod: ContactMethod.fromValue(dto.preferredMethod),
        }
      : undefined;
  },

  toTouchEntity: (dto: TouchDTO): Touch | undefined => {
    return dto
      ? {
          ...dto,
          method: ContactMethod.fromValue(dto.method),
        }
      : undefined;
  },

  // Entity to DTO (for API responses)
  toContactDTO: (entity: Contact): ContactDTO => {
    return {
      ...entity,
      preferredMethod: entity.preferredMethod.value,
    };
  },

  toTouchDTO: (entity: Touch): TouchDTO => {
    return {
      ...entity,
      method: entity.method.value,
    };
  },

  toContactListDTO: (entities: Contact[]): ContactListDTO => {
    return entities.map((entity) => ({
      ...entity,
      preferredMethod: entity.preferredMethod.value,
    }));
  },

  // DTO to Entity (for API requests)
  toContactDTOPartial: (entity: Contact): ContactDTOPartial => {
    return { ...entity, preferredMethod: entity.preferredMethod.value };
  },

  toTouchDTOPartial: (entity: Touch): TouchDTOPartial => {
    return { ...entity, method: entity.method.value };
  },
});

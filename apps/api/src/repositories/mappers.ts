import type {
  ContactDTO,
  ContactDTOPartial,
  ContactListDTO,
  TouchDTO,
  TouchDTOPartial,
} from '@network/contracts';
import { Contact, ContactMethod, Touch } from '@network/contracts';
import { reviveSmartEnums, serializeSmartEnums } from 'smart-enums';

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
  toContactEntity: (dto?: ContactDTO): Contact | undefined =>
    reviveSmartEnums<Contact>(dto, {
      preferredMethod: ContactMethod,
    }),
  toTouchEntity: (dto: TouchDTO): Touch | undefined =>
    dto
      ? reviveSmartEnums<Touch>(dto, {
          method: ContactMethod,
        })
      : undefined,

  // Entity to DTO (for API responses)
  toContactDTO: (entity: Contact): ContactDTO => serializeSmartEnums(entity),

  toTouchDTO: (entity: Touch): TouchDTO => serializeSmartEnums(entity),

  toContactListDTO: (entities: Contact[]): ContactListDTO => {
    return entities.map(serializeSmartEnums<ContactDTO>);
  },

  // DTO to Entity (for API requests)
  toContactDTOPartial: (entity: Contact): ContactDTOPartial => serializeSmartEnums(entity),

  toTouchDTOPartial: (entity: Touch): TouchDTOPartial => serializeSmartEnums(entity),
});

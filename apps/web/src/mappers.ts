import type { ContactDTO, ContactDTOPartial, TouchDTO, TouchDTOPartial } from '@network/contracts';
import { Contact, ContactMethod, Touch } from '@network/contracts';
import { reviveSmartEnums, serializeSmartEnums } from 'smart-enums';

export interface Mappers {
  // Database to Entity (internal use)
  toContact: (dto?: ContactDTO) => Contact | undefined;
  toTouch: (dto: TouchDTO) => Touch | undefined;

  toContactDTO: (entity: Contact) => ContactDTOPartial;
  toTouchDTO: (entity: Touch) => TouchDTOPartial;
}

export const mappers = {
  // Database to Entity (internal use)
  toContact: (dto?: ContactDTO): Contact | undefined =>
    reviveSmartEnums<Contact>(dto, {
      preferredMethod: ContactMethod,
    }),
  toTouch: (dto: TouchDTO): Touch | undefined =>
    dto
      ? reviveSmartEnums<Touch>(dto, {
          method: ContactMethod,
        })
      : undefined,

  // Entity to DTO (for API responses)
  toContactDTO: (entity: Contact): ContactDTO => serializeSmartEnums(entity),

  toTouchDTO: (entity: Touch): TouchDTO => serializeSmartEnums(entity),
};

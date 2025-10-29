import { enumeration } from 'smart-enums';
import { validateContact, validateInsertContact, validateInsertTouch, validateInsertUser, validateTouch, validateUpdateContact, validateUpdateUser, validateUser, } from '../../validators/registry/registry';
const input = {
    contact: { validate: validateContact },
    insertContact: { validate: validateInsertContact },
    updateContact: { validate: validateUpdateContact },
    touch: { validate: validateTouch },
    insertTouch: { validate: validateInsertTouch },
    user: { validate: validateUser },
    insertUser: { validate: validateInsertUser },
    updateUser: { validate: validateUpdateUser },
};
export const Validator = enumeration('Validator', {
    input,
});

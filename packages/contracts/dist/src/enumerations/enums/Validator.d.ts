import { Enumeration } from 'smart-enums';
import typia from 'typia';
type ValidatorItem = {
    validate: (data: unknown) => typia.IValidation<unknown>;
};
export declare const Validator: {
    contact: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    insertContact: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    updateContact: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    touch: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    insertTouch: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    user: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    insertUser: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    updateUser: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
} & {
    fromValue: (target: string) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    fromKey: (target: string) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    fromDisplay: (target: string) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>;
    tryFromValue: (target?: string | null) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem> | undefined;
    tryFromKey: (target?: string | null) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem> | undefined;
    tryFromCustomField: (field: "validate", target?: string | null, filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem> | undefined;
    tryFromDisplay: (target?: string | null) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem> | undefined;
    toCustomFieldValues: <X = string>(field: "validate", filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => X[];
    toOptions: (filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => import("smart-enums").DropdownOption[];
    toValues: (filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toKeys: (filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toDisplays: (filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toEnumItems: (filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>[];
    toExtendableObject: <ITEM_TYPE extends import("smart-enums").BaseEnum>(filter?: ((item: import("smart-enums").EnumItem<{
        contact: {
            validate: (data: unknown) => typia.IValidation<import("../..").Contact>;
        };
        insertContact: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Contact, "id">>;
        };
        updateContact: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").Contact>>;
        };
        touch: {
            validate: (data: unknown) => typia.IValidation<import("../..").Touch>;
        };
        insertTouch: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").Touch, "id">>;
        };
        user: {
            validate: (data: unknown) => typia.IValidation<import("../..").User>;
        };
        insertUser: {
            validate: (data: unknown) => typia.IValidation<Omit<import("../..").User, "id">>;
        };
        updateUser: {
            validate: (data: unknown) => typia.IValidation<Partial<import("../..").User>>;
        };
    }, ValidatorItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => Record<string, ITEM_TYPE>;
} & Record<string, never>;
export type Validator = Enumeration<typeof Validator>;
export {};
//# sourceMappingURL=Validator.d.ts.map
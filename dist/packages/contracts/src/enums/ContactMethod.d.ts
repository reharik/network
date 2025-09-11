import { Enumeration } from 'smart-enums';
type Contactable = {
    email?: string;
    sms?: string;
    call?: string;
    other?: string;
};
type ContactMethodItem = {
    link: (handle: Contactable) => string;
    handle: (handle: Contactable) => string;
};
export declare const ContactMethod: {
    email: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
    sms: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
    call: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
    other: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
} & {
    fromValue: (target: string) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
    fromKey: (target: string) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
    fromDisplay: (target: string) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>;
    tryFromValue: (target?: string | null) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem> | undefined;
    tryFromKey: (target?: string | null) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem> | undefined;
    tryFromCustomField: (field: keyof ContactMethodItem, target?: string | null, filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem> | undefined;
    tryFromDisplay: (target?: string | null) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem> | undefined;
    toCustomFieldValues: <X = string>(field: keyof ContactMethodItem, filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => X[];
    toOptions: (filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => import("smart-enums").DropdownOption[];
    toValues: (filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toKeys: (filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toDisplays: (filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toEnumItems: (filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>[];
    toExtendableObject: <ITEM_TYPE extends import("smart-enums").BaseEnum>(filter?: ((item: import("smart-enums").EnumItem<{
        email: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        sms: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        call: {
            link: (contactable: Contactable) => string;
            handle: (contactable: Contactable) => string | undefined;
        };
        other: {
            link: () => string;
            handle: () => string;
        };
    }, ContactMethodItem>) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => Record<string, ITEM_TYPE>;
} & Record<string, never>;
export type ContactMethod = Enumeration<typeof ContactMethod>;
export {};
//# sourceMappingURL=ContactMethod.d.ts.map
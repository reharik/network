import { Enumeration } from 'smart-enums';
export declare const ContactMethod: {
    other: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
    email: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
    sms: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
    call: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
} & {
    fromValue: (target: string) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
    fromKey: (target: string) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
    fromDisplay: (target: string) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">;
    tryFromValue: (target?: string | null) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call"> | undefined;
    tryFromKey: (target?: string | null) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call"> | undefined;
    tryFromCustomField: (field: string, target?: string | null, filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call"> | undefined;
    tryFromDisplay: (target?: string | null) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call"> | undefined;
    toCustomFieldValues: <X = string>(field: string, filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => X[];
    toOptions: (filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => import("smart-enums").DropdownOption[];
    toValues: (filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toKeys: (filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toDisplays: (filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => string[];
    toEnumItems: (filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">[];
    toExtendableObject: <ITEM_TYPE extends import("smart-enums").BaseEnum>(filter?: ((item: import("smart-enums").EnumItem<{
        other: import("smart-enums").BaseEnum;
        email: import("smart-enums").BaseEnum;
        sms: import("smart-enums").BaseEnum;
        call: import("smart-enums").BaseEnum;
    }, Record<string, never>, "other" | "email" | "sms" | "call">) => boolean) | undefined, filterOptions?: {
        showEmpty?: boolean;
        showDeprecated?: boolean;
    }) => Record<string, ITEM_TYPE>;
} & Record<string, never>;
export type ContactMethod = Enumeration<typeof ContactMethod, typeof ContactMethod>;
export declare const parseContactMethod: (s: string) => ContactMethod | undefined;

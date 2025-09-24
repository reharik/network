import * as EnumRegistry from '../enums';
export declare const smartEnumRegistry: Record<string, {
    tryFromValue: (value: string) => unknown;
}>;
export declare const createSmartEnumJSONReviver: ({ Enums }: {
    Enums: typeof EnumRegistry;
}) => (key: string, value: unknown) => unknown;
//# sourceMappingURL=smartEnumUtils.d.ts.map
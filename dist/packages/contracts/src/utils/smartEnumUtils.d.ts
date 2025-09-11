export declare const smartEnumRegistry: Record<string, {
    tryFromValue: (value: string) => unknown;
}>;
export declare const createSmartEnumReviver: (registry: typeof smartEnumRegistry) => (key: string, value: unknown) => unknown;
//# sourceMappingURL=smartEnumUtils.d.ts.map
// types/import-meta-glob.d.ts
interface ImportMeta {
  glob(
    pattern: string | string[],
    options?: {
      eager?: boolean;
      import?: string;
      // you can extend this if your bundler supports more options
    },
  ): Record<string, unknown>;
}

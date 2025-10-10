import { Context, Next } from 'koa';
import { reviveAfterTransport } from 'smart-enums';

export type SmartEnumRequestReviver = (ctx: Context, next: Next) => Promise<void>;

// Middleware to rehydrate serialized smart enums in request body using the new reviveSmartEnums API
export const smartEnumRequestReviver = async (ctx: Context, next: Next): Promise<void> => {
  // Only process if there's a request body

  if (ctx.request.body && typeof ctx.request.body === 'object') {
    // Use the new reviveSmartEnums API that handles both serialized and raw enum values
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctx.request.body = reviveAfterTransport(ctx.request.body);
  }

  await next();
};

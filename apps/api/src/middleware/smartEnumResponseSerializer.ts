import { Context, Next } from 'koa';

// Middleware to ensure smart enums are properly serialized in responses
export const smartEnumResponseSerializer = async (ctx: Context, next: Next) => {
  await next();

  // Only serialize if there's a response body
  if (ctx.body && typeof ctx.body === 'object') {
    // Use JSON.stringify to call toJSON() on smart enums, which produces the correct serialized format
    const jsonString = JSON.stringify(ctx.body);
    ctx.body = jsonString;
    ctx.type = 'application/json';
  }
};

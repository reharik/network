import { Context, Next } from 'koa';

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message || 'Internal Server Error' };
  }
}

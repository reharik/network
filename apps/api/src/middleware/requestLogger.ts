import { Context, Next } from 'koa';

export async function requestLogger(ctx: Context, next: Next) {
  console.log('REQ', ctx.method, ctx.path);
  await next();
  console.log('RES', ctx.status, ctx.path);
}

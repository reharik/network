import { Context, Next } from 'koa';

export const requestLogger = async (ctx: Context, next: Next) => {
  console.log('REQ', ctx.method, ctx.path);
  await next();
  console.log('RES', ctx.status, ctx.path);
};

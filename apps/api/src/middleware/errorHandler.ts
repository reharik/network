import { Context, HttpError, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.status = err.status || 500;
      ctx.body = { error: err.expose ? err.message : 'Internal Server Error' };
    } else if (err instanceof Error) {
      ctx.body = { error: err.message ? err.message : 'Internal Server Error' };
    }
    ctx.app.emit('error', err, ctx);
  }
};

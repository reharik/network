import { Context } from 'koa';
import { createTouch as createTouchDB } from '../repositories/touchesRepository';
import { createTouchSchema } from '@network/contracts';

export const createTouch = async (ctx: Context): Promise<Context> => {
  const val = createTouchSchema.safeParse(ctx.request.body);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: val.error.issues };
    return ctx;
  }

  const userId = ctx.user.id;
  const touch = await createTouchDB(ctx.db, userId, val.data);

  if (!touch) {
    ctx.status = 404;
    ctx.body = { error: 'Contact not found' };
    return ctx;
  }

  ctx.status = 201;
  ctx.body = touch;
  return ctx;
};

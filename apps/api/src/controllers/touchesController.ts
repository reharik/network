import { Context } from 'koa';
import { createTouchBodySchema } from './requestSchemas';
import { createTouch as repoCreateTouch } from '../repositories/touchesRepository';

type StateUser = { id: string };

export const createTouch = async (ctx: Context): Promise<Context> => {
  const val = createTouchBodySchema.safeParse(ctx.request.body);
  if (!val.success) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid request format', issues: val.error.issues };
    return ctx;
  }

  const userId = (ctx.state.user as StateUser).id;
  const touch = await repoCreateTouch(ctx.db, userId, val.data);

  if (!touch) {
    ctx.status = 404;
    ctx.body = { error: 'Contact not found' };
    return ctx;
  }

  ctx.status = 201;
  ctx.body = touch;
  return ctx;
};

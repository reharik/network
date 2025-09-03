import type { Context } from 'koa';
import { createTouchSchema } from '@network/contracts';
import type { TouchesRepository } from '../repositories/touchesRepository';
import type { TouchDTO } from '@network/contracts';
import type { Mappers } from '../repositories/mappers';

export interface TouchesController {
  createTouch: (ctx: Context) => Promise<Context>;
}

export const createTouchesController = (
  touchesRepository: TouchesRepository,
  mappers: Mappers,
): TouchesController => ({
  createTouch: async (ctx: Context): Promise<Context> => {
    const val = createTouchSchema.safeParse(ctx.request.body);
    if (!val.success) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid request format', issues: val.error.issues };
      return ctx;
    }

    const userId = ctx.user.id;
    const entity = await touchesRepository.createTouch(userId, val.data);

    if (!entity) {
      ctx.status = 404;
      ctx.body = { error: 'Contact not found' };
      return ctx;
    }

    const touch: TouchDTO = mappers.toTouchDTO(entity);
    ctx.status = 201;
    ctx.body = touch;
    return ctx;
  },
});

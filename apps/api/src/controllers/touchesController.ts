import type { Context } from 'koa';
import type { TouchesRepository } from '../repositories/touchesRepository';
import type { TouchDTOPartial } from '@network/contracts';

export interface TouchesController {
  createTouch: (ctx: Context) => Promise<Context>;
}

export const createTouchesController = ({
  touchesRepository,
}: {
  touchesRepository: TouchesRepository;
}): TouchesController => ({
  createTouch: async (ctx: Context): Promise<Context> => {
    const userId = ctx.user.id;
    const touchData = ctx.request.body as TouchDTOPartial;
    const touch = await touchesRepository.createTouch(userId, touchData);
    if (!touch) {
      ctx.status = 404;
      ctx.body = { error: 'Contact not found' };
      return ctx;
    }
    ctx.status = 201;
    ctx.body = touch;
    return ctx;
  },
});

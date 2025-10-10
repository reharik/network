import { validateInsertTouch } from '@network/validators';
import { RESOLVER } from 'awilix';
import type { Context } from 'koa';
import type { Container } from '../container';

export interface TouchesController {
  createTouch: (ctx: Context) => Promise<Context>;
}

export const createTouchesController = ({ touchesRepository }: Container): TouchesController => ({
  createTouch: async (ctx: Context): Promise<Context> => {
    const userId = ctx.user.id;
    const validation = validateInsertTouch({ userId, ...ctx.request.body });
    if (!validation.success) {
      ctx.status = 400;
      ctx.body = {
        error: 'Invalid request format',
        issues: validation.errors,
      };
      return ctx;
    }
    const touch = await touchesRepository.createTouch(userId, validation.data);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createTouchesController as any)[RESOLVER] = {};

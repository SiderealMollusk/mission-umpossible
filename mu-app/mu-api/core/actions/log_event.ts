import type { ActionFn } from '../../../shared/types';

export const log_event: ActionFn<string> = async (arg, ctx) => {
  console.log('[log_event] Logging event:', {
    event: arg,
    context: ctx,
  });
};

import { ActionFn } from './types';

export const log_event: ActionFn = async (arg, ctx) => {
  console.log('[log_event] Logging event:', {
    event: arg,
    context: ctx,
  });

  // TODO: Write event to persistent store (logs or enriched_logs)
};

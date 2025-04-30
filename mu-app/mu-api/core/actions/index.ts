// core/actions/index.ts
import { ActionFn } from './types';
import { send_message } from './send_message';
import { log_event } from './log_event';

// ... more

export const actionHandlers: Record<string, ActionFn> = {
  send_message,
  log_event,
  // etc
};
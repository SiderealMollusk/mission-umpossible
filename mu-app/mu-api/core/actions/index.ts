//Actions are *specificially* fn to be invoked from the activities in the json spec. 
//They are mapped here. 
//They might use internal code, but the point is to have a list of valid fns

// core/actions/index.ts
import { ActionFn } from '../../../shared/types';
import { send_message } from './send_message';
import { log_event } from './log_event';

// ... more

export const actionHandlers: Record<string, ActionFn> = {
  send_message,
  log_event,
  // etc
};
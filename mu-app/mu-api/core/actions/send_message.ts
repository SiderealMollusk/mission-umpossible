import type { ActionFn } from '../../../shared/types';
import type { MessageContext, OutgoingTrigger } from '../../../shared/types';

/**
 * Action handler for sending a literal message.
 */
export const send_message: ActionFn<{ literal: string }> = async (arg, ctx) => {
  return [{
    channel: ctx.channel,
    to:      ctx.source,
    message: arg.literal,
  }];
};
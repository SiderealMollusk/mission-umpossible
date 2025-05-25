import type { ActionFn } from '../../../shared/types';
import type { MessageContext, OutgoingTrigger } from '../../../shared/types';

/**
 * Send a literal (not LLM generated) message
 */
export const send_message: ActionFn<{ literal: string }> = async (arg, ctx) => {
  return [{
    channel: ctx.channel,
    to:      ctx.source,
    message: arg.literal,
  }];
};
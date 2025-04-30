import { sendViaSignal } from './send_message_signal';
import { ActionFn } from './types';


export const send_message: ActionFn = async (arg, ctx) => {
    const recipient = arg.to ?? ctx.transports?.signal ?? ctx.character_id;
    const { channels } = arg;
  
    if ('literal' in arg) {
      console.log('[send_message] Sending literal:', {
        to: recipient,
        channels,
        message: arg.literal,
      });
      if (channels.includes('signal')) {
        await sendViaSignal({
          to: recipient,
          message: arg.literal,
        });
      }
    } else if ('prompt' in arg) {
      console.log('[send_message] Generating from prompt:', {
        to: recipient,
        channels,
        prompt: arg.prompt,
        context: arg.context,
      });
      // TODO: integrate LLM message generation
    } else {
      console.warn('[send_message] Invalid message arg shape:', arg);
    }
  };
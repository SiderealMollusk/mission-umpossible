import { json } from 'stream/consumers';
import { MessageContext, OutgoingTrigger } from '../../shared/types';

/**
 * Stub business logic handler: logs context and returns no triggers.
 */
export async function handleMessage(ctx: MessageContext): Promise<OutgoingTrigger[]> {
  const playerName = ctx.player.display_name;

  // Typing events: log and drop
  if (ctx.typing) {
    console.log(`${playerName} ${ctx.typing} typing`);
    return [];
  }

  // Non-typing messages:
  

  //is start? --> run on_start triggers IN ORDER
  const reply = `check logs`;
  console.log('Full MessageContext:', JSON.stringify(ctx, null, 2));
  return [
    {
      channel: ctx.channel,
      to: ctx.source,
      message: reply,
    },
  ];
}

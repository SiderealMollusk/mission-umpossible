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

  // Non-typing messages: echo back
  const receivedText = ctx.text ?? '';
  const reply = `You said '${receivedText}'. Back at ya`;
  console.log(`↩️ Echoing back to ${ctx.source}: ${reply}`);

  return [
    {
      channel: ctx.channel,
      to: ctx.source,
      message: reply,
    },
  ];
}

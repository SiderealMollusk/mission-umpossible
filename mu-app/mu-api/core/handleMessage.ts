import { MessageContext, OutgoingTrigger } from '../../shared/types';
import { getDbClient } from '../db';
import { actionHandlers } from './actions';
import { characterChatResponse } from './characterChatResponse';

/**
 * Stub business logic handler: logs context and returns no triggers.
 */
export async function handleMessage(ctx: MessageContext): Promise<OutgoingTrigger[]> {
  // Typing events: log and drop — handle first to avoid unnecessary DB work
  if (ctx.typing) {
    console.log(`${ctx.player.display_name} ${ctx.typing} typing`);
    return [];
  }

  // If this is a fresh activity, run its on_start triggers
  if (ctx.activity?.state && !ctx.activity.state.payload.initialized) {
    const spec = ctx.activity.definition.spec;
    const client = getDbClient();
    await client.connect();
    try {
      const outgoing: OutgoingTrigger[] = [];
      for (const trigger of spec.on_start ?? []) {  //get the strings from json
        const handler = actionHandlers[trigger.fn]; //use string to get fn from function map
        if (!handler) {
          console.warn(`No handler for trigger ${trigger.fn}`);
          continue;
        }
        // Execute and collect any outgoing triggers
        const results = await handler(trigger.arg as any, ctx);
        if (Array.isArray(results)) {
          outgoing.push(...results);
        }
      }
      // Mark initialized so this block doesn't run again
      await client.query(
        `UPDATE activity_states
           SET payload = payload || '{"initialized":true}'::jsonb
         WHERE id = $1`,
        [ctx.activity.state.id]
      );
      return outgoing;
    } finally {
      await client.end();
    }
  }

  // If activity is already initialized, delegate to chatResponse
  return await characterChatResponse(ctx);
}

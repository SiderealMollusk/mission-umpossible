import { MessageContext, OutgoingTrigger } from '../../shared/types';
import { getDbClient } from '../db';
import { actionHandlers } from './actions';
import { characterChatResponse } from './characterChatResponse';

/**
 * HandleMessage accepts a transport agnostic message context ,
 * - figures out what to do with it
 * - based on activity state
 * - Likely calls "chatResponse", which handles LLM stuff
 * - executes a message side effects, and returns any messages to dispatch.
 * 
 * This script handles on_start from the spec
 * - chatResponse handles use of chat tools, 
 */
export async function handleMessage(ctx: MessageContext): Promise<OutgoingTrigger[]> {
  // Typing events: log and drop — handle first to avoid unnecessary DB work
  if (ctx.typing) {
    console.log(`${ctx.player.display_name} ${ctx.typing} typing`);
    return [];
  }

  // If this is a fresh activity, run its on_start triggers or mark initialized
  if (ctx.activity?.state && !ctx.activity.state.payload.initialized) {
    const spec = ctx.activity.definition.spec;
    const client = getDbClient();
    await client.connect();
    try {
      // Mark initialized so this block doesn't run again
      await client.query(
        `UPDATE activity_states
           SET payload = payload || '{"initialized":true}'::jsonb
         WHERE id = $1`,
        [ctx.activity.state.id]
      );

      if (spec.on_start?.length) {
        const outgoing: OutgoingTrigger[] = [];
        for (const trigger of spec.on_start) {
          const handler = actionHandlers[trigger.fn];
          if (!handler) {
            console.warn(`No handler for trigger ${trigger.fn}`);
            continue;
          }
          const results = await handler(trigger.arg as any, ctx);
          if (Array.isArray(results)) {
            outgoing.push(...results);
          }
        }
        return outgoing;
      }

      // No on_start triggers: run normal chat response for the new activity immediately
      await client.end();
      return await characterChatResponse(ctx);
    } finally {
      // client.end() removed here to avoid double closing
    }
  }

  // If activity is already initialized or no triggers to run, delegate to chatResponse
  return await characterChatResponse(ctx);
}

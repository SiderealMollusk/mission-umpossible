import { getDbClient } from '../db';
import { ActivitySpec, ActivityTrigger } from '../../shared/models/Activity_Spec';
import { ActionContext, ActionFn } from '../core/actions/types';
import { actionHandlers } from '../core/actions';
import { send_message } from '../core/actions/send_message';
import { log_event } from '../core/actions/log_event';

async function executeTrigger(trigger: ActivityTrigger, ctx: ActionContext): Promise<void> {
  switch (trigger.fn) {
    case 'send_message':
      // Ensure we send to the actual transport address, not the character ID
      const sendArg = { ...trigger.arg };
      if (ctx.transports.signal && Array.isArray(sendArg.channels) && sendArg.channels.includes('signal')) {
        sendArg.to = ctx.transports.signal;
      }
      return send_message(sendArg, ctx);

    case 'log_event':
      return log_event(trigger.arg, ctx);

    default:
      const _: never = trigger;
      throw new Error(`Unhandled trigger type: ${(trigger as any).fn}`);
  }
}

export async function startActivityForCharacter(
  activity_id: string,
  character_id: string
): Promise<void> {
  const client = getDbClient();
  await client.connect();

  try {
    const result = await client.query('SELECT spec FROM activities WHERE id = $1 LIMIT 1', [
      activity_id,
    ]);

    if (result.rowCount === 0) {
      throw new Error(`Activity ${activity_id} not found`);
    }

    const spec = result.rows[0].spec as ActivitySpec;

    // Query for signal transport address for the character's player
    const transportResult = await client.query(
      `
      SELECT pt.address
      FROM character_assignments ca
      JOIN player_transports pt ON pt.player_id = ca.player_id
      WHERE ca.character_id = $1 AND pt.transport = 'signal'
      LIMIT 1
      `,
      [character_id]
    );

    const signalAddress =
      (transportResult.rowCount ?? 0) > 0 ? transportResult.rows[0].address : undefined;

    if (
      spec.on_start === undefined ||
      !Array.isArray(spec.on_start) ||
      spec.on_start.length === 0
    ) {
      console.log(`No on_start steps to run for activity ${activity_id}`);
      return;
    }

    const ctx: ActionContext = {
      activity_id,
      character_id,
      transports: {
        signal: signalAddress,
      },
    };

    for (const trigger of spec.on_start ?? []) {
      try {
        await executeTrigger(trigger, ctx);
      } catch (err) {
        console.error(`Action ${trigger.fn} failed:`, err);
      }
    }
  } finally {
    await client.end();
  }
}
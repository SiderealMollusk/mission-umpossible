//TODO, cache db look ups for the same batch, so you don't do a massive look up for 
// starting and stopping typing.

import { getDbClient } from '../db';
import { IncomingMessage, MessageContext, OutgoingTrigger } from '../../shared/types';
import { handleMessage } from './handleMessage';
import { sendTriggers } from './sender';
import { Player } from '../../shared/models/Player';
import { Character } from '../../shared/models/Character';
import { ActivityState } from '../../shared/models/ActivityState';
import { Activity } from '../../shared/models/Activity';
import { recordIncoming, recordOutgoing } from './llm/chatHistory';

export async function dispatchIncoming(batch: IncomingMessage[]): Promise<void> {
  const client = getDbClient();
  await client.connect();
  console.log(`dispatchIncoming invoked with batch size: ${batch.length}`);

  try {
    for (const msg of batch) {
      const { channel, source, text, typing, attachments, timestamp, raw } = msg;

      // Lookup player transport to get player_id
      const transportRes = await client.query(
        `SELECT player_id FROM player_transports WHERE transport = $1 AND address = $2 LIMIT 1`,
        [channel, source]
      );
      if ((transportRes.rowCount ?? 0) === 0) {
        console.warn(`No player found for ${channel} address ${source}`);
        continue;
      }

      // 1. Lookup player by id from player_transports
      const playerRes = await client.query<Player>(
        `SELECT * FROM players WHERE id = $1 LIMIT 1`,
        [transportRes.rows[0].player_id]
      );
      if ((playerRes.rowCount ?? 0) === 0) {
        console.warn(`No player found with id ${transportRes.rows[0].player_id}`);
        continue;
      }
      const player = playerRes.rows[0];

      // 2. Lookup active character for player
      const charAssignRes = await client.query(
        `SELECT character_id FROM character_assignments
         WHERE player_id = $1 AND assignment_type = 'active' LIMIT 1`,
        [player.id]
      );
      if ((charAssignRes.rowCount ?? 0) === 0) {
        console.warn(`No active character for player ${player.id}`);
        continue;
      }

      const charRes = await client.query<Character>(
        `SELECT * FROM characters WHERE id = $1 LIMIT 1`,
        [charAssignRes.rows[0].character_id]
      );
      if ((charRes.rowCount ?? 0) === 0) {
        console.warn(`No character found with id ${charAssignRes.rows[0].character_id}`);
        continue;
      }
      const character = charRes.rows[0];

      // 3. Lookup current activity state for character
      const stateRes = await client.query<ActivityState>(
        `SELECT
           id,
           character_id AS "characterId",
           activity_id  AS "activityId",
           payload,
           created_at   AS "createdAt"
         FROM activity_states
         WHERE character_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [character.id]
      );
      if ((stateRes.rowCount ?? 0) === 0) {
        console.warn(`No activity state for character ${character.id}, proceeding without state`);
      }
      const activityState = stateRes.rows[0]; // may be undefined

      // 4. Lookup activity if state exists
      let activity: Activity | undefined;
      if (activityState?.activityId) {
        const activityRes = await client.query<Activity>(
          `SELECT
             id,
             name,
             description,
             spec,
             created_at AS "createdAt"
           FROM activities
           WHERE id = $1
           LIMIT 1`,
          [activityState.activityId]
        );
        if ((activityRes.rowCount ?? 0) > 0) {
          activity = activityRes.rows[0];
        } else {
          console.warn(`No activity found with id ${activityState.activityId}`);
        }
      } else {
        console.warn(`No activityState.activityId for character ${character.id}`);
      }

      // 5. Fetch NPC character if activity and spec exist
      let npcCharacter: Character | undefined;
      if (activity?.spec?.contact_character) {
        const contactName = activity.spec.contact_character;
        const npcRes = await client.query<Character>(
          `SELECT * FROM characters WHERE name = $1 LIMIT 1`,
          [contactName]
        );
        if ((npcRes.rowCount ?? 0) > 0) {
          npcCharacter = npcRes.rows[0];
        } else {
          console.warn(`No NPC character found with name ${contactName}`);
        }
      }

      // 6. Build enriched context
      const ctx: MessageContext = {
        player,
        character,
        activity: activity
          ? {
              definition: activity,
              state: activityState,
            }
          : undefined,
        npcCharacter,
        channel,
        source,
        text,
        typing,
        attachments,
        timestamp,
        raw,
      };

      // Persist inbound message
      try {
        await recordIncoming(ctx);
      } catch (err) {
        console.error('Failed to record incoming chat turn:', err);
      }

      // 7. Invoke business logic
      let triggers: OutgoingTrigger[];
      try {
        triggers = await handleMessage(ctx);
        if (!triggers || triggers.length === 0) {
          console.log('No triggers returned for this message');
        }
      } catch (err) {
        console.error('handleMessage error for', ctx, err);
        continue;
      }

      // 8. Dispatch outgoing triggers and record successes
      const results = await sendTriggers(triggers);
      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (res.ok) {
          try {
            await recordOutgoing(ctx, triggers[i]);
          } catch (err) {
            console.error('Failed to record outgoing chat turn:', err);
          }
        }
      }
      if(ctx.isFinished){
        console.log("Message handled and dispatched. On_Finish Here")
      }
    }
  } finally {
    await client.end();
  }
}
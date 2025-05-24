import { Router } from 'express';
import { getDbClient } from '../db';
import { dispatchIncoming } from '../core/dispatch';
import type { IncomingMessage } from '../../shared/types';

const router = Router();

/**
 * POST /api/v1/onboard
 * Accepts an array of character_ids to onboard.
 * Looks up the onboarding activity ID from game_config and logs its spec.
 */
router.post('/', async (req, res) => {
  const { character_ids } = req.body;

  if (!Array.isArray(character_ids)) {
    return res.status(400).json({ error: 'character_ids must be an array' });
  }

  const client = getDbClient();
  await client.connect();

  try {
    const configResult = await client.query(
      `SELECT value FROM game_config WHERE key = 'onboarding_activity_id' LIMIT 1`
    );

    if (configResult.rowCount === 0) {
      return res.status(500).json({ error: 'onboarding_activity_id not set in game_config' });
    }

    const activityId = configResult.rows[0].value;

    for (const character_id of character_ids) {
      console.debug(`Onboarding character ${character_id} with activity ${activityId}`);

      // 1) Create initial activity_state for this character
      await client.query(
        `INSERT INTO activity_states (character_id, activity_id)
         VALUES ($1, $2)`,
        [character_id, activityId]
      );

      // 2) Look up the player's Signal address
      const transportRes = await client.query(
        `
        SELECT pt.address
        FROM character_assignments ca
        JOIN player_transports pt ON pt.player_id = ca.player_id
        WHERE ca.character_id = $1
          AND pt.transport = 'signal'
        LIMIT 1
        `,
        [character_id]
      );
      const signalAddress = transportRes.rows[0]?.address;

      // 3) Build a fake IncomingMessage to trigger onboarding via dispatch
      const fakeMsg: IncomingMessage = {
        channel: 'signal',
        source: signalAddress,
        text: '',                // no text; triggers on_start
        typing: undefined,
        attachments: undefined,
        timestamp: Date.now(),  // epoch millis
        raw: {},
      };

      // 4) Dispatch through the normal pipeline
      await dispatchIncoming([fakeMsg]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error during onboarding:", err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});

export default router;

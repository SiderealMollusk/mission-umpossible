import { Router } from 'express';
import { getDbClient } from '../db';
import { startActivityForCharacter } from '../core/activities';

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
      await startActivityForCharacter(activityId, character_id);
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

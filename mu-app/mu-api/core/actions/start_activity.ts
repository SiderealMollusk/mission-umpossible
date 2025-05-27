import { getDbClient } from '../../db';
import type { ActionFn } from '../../../shared/types';

export const start_activity: ActionFn<string> = async (arg, ctx) => {
  console.log(`[start_activity] starting activity "${arg}" for character ${ctx.character.id}`);
  const client = getDbClient();
  await client.connect();
  try {
    // Find the activity by title
    const res = await client.query(
      `SELECT id FROM activities WHERE spec->>'title' = $1`,
      [arg]
    );
    if (res.rowCount === 0) {
      throw new Error(`Activity spec with title "${arg}" not found`);
    }
    const activityId = res.rows[0].id;

    // Create a new activity state
    const insertRes = await client.query(
      `INSERT INTO activity_states (activity_id, character_id, payload)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [activityId, ctx.character.id, { initialized: false }]
    );
    const stateId = insertRes.rows[0].id;
    console.log(`[start_activity] created activity_state ${stateId}`);

    return []; // No outgoing triggers by default
  } finally {
    await client.end();
  }
};
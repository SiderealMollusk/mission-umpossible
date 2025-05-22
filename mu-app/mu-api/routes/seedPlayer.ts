import { Router } from 'express';
import { getDbClient } from '../db';
import { v4 as uuidv4 } from 'uuid';

// Supabase admin user ID for record ownership
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
if (!ADMIN_USER_ID) throw new Error('ADMIN_USER_ID must be set in environment');

const router = Router();

/**
 * POST /api/v1/players/seed
 * Creates a new player, associated transport, and character.
 * Expects: { display_name, character_name, phone_number }
 */
router.post('/', async (req, res) => {
  const { display_name, character_name, phone_number } = req.body;

  if (!display_name || !character_name || !phone_number) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Generate UUIDs for player, character, and transport
  const player_id = uuidv4();
  const character_id = uuidv4();
  const transport_id = uuidv4();

  const client = getDbClient();
  await client.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO players (id, display_name) VALUES ($1, $2)`,
      [player_id, display_name]
    );

    await client.query(
      `INSERT INTO player_transports (id, player_id, transport, address, validated)
       VALUES ($1, $2, 'signal', $3, false)`,
      [transport_id, player_id, phone_number]
    );

    await client.query(
      `INSERT INTO characters (id, name, owner_id, creator_id, species) VALUES ($1, $2, $3, $4, $5)`,
      [character_id, character_name, ADMIN_USER_ID, player_id, 'Human']
    );

    const assignment_id = uuidv4();
    await client.query(
      `INSERT INTO character_assignments (id, character_id, player_id, assignment_type)
       VALUES ($1, $2, $3, $4)`,
      [assignment_id, character_id, player_id, 'active']
    );

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Player bundle created successfully',
      player_id,
      character_id,
      transport_id,
      creator_id: player_id,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting player bundle:', error);
    res.status(500).json({ error: 'Internal server error', detail: error });
  } finally {
    await client.end();
  }
});

export default router;
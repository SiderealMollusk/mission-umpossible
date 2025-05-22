import { Router, Request, Response } from 'express';
import { getDbClient } from '../db';
// import other handlers as needed, e.g., startActivityForCharacter

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const messages = req.body;
  console.log(`↔️  Received batch of ${Array.isArray(messages) ? messages.length : 0} envelopes`);
  console.log('📥 Raw request body:', JSON.stringify(req.body));

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid payload: expected an array of messages' });
  }

  const client = await getDbClient();

  try {
    for (const envelope of messages) {
      const source = envelope?.envelope?.source;
      if (!source) {
        console.log('Missing source in envelope:', envelope);
        continue;
      }

      const messageText = envelope.envelope?.dataMessage?.message;
      if (messageText) {
        console.log(`${source}: ${messageText}`);
      }

      const result = await client.query(
        `
        SELECT ca.player_id, ca.character_id
        FROM character_assignments ca
        JOIN player_transports pt
          ON pt.player_id = ca.player_id
        WHERE pt.transport = 'signal'
          AND pt.address = $1
        LIMIT 1
        `,
        [source]
      );

      if (result.rowCount! > 0) {
        const { player_id: playerId, character_id: characterId } = result.rows[0];
        const text = envelope.envelope?.dataMessage?.message ?? '[no message]';
        console.log(`handling: ${playerId}, as ${characterId} said '${text}' via ${source}`);
        // Additional processing can be done here
      } else {
        console.log(`No character found for source ${source}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing incoming messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});

export default router;
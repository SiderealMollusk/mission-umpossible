import 'dotenv/config';
import { Client } from 'pg';
import type { MessageContext, OutgoingTrigger } from '../../../shared/types';
import type { ChatTurn } from '../../../shared/models/ChatTurn';

/**
 * Create a new Postgres client.
 * Requires `pg` and `@types/pg`.
 */
function getDbClient() {
  return new Client({ connectionString: process.env.DATABASE_URL });
}

async function getGameConfig(key: string): Promise<string | null> {
  const client = getDbClient();
  await client.connect();
  try {
    const res = await client.query<{ value: string }>(
      `SELECT value FROM game_config WHERE key = $1 LIMIT 1`,
      [key]
    );
    return (res.rowCount ?? 0) > 0 ? res.rows[0].value : null;
  } finally {
    await client.end();
  }
}

/**
 * Load the most recent chat history for a given activity state.
 * @param activityStateId UUID of the activity_state row
 * @param limit Maximum number of turns to retrieve (default 10)
 */
export async function loadChatHistory(
  activityStateId: string,
  limit?: number
): Promise<ChatTurn[]> {
  if (limit === undefined) {
    const cfg = await getGameConfig('n_chatTurns');
    const n = cfg ? parseInt(cfg, 10) : NaN;
    limit = Number.isInteger(n) ? n : 10;
  }
  const client = getDbClient();
  await client.connect();
  try {
    const res = await client.query<ChatTurn>(
      `SELECT
         id,
         activity_state_id     AS "activityStateId",
         from_character_id     AS "fromCharacterId",
         to_character_ids      AS "toCharacterIds",
         role,
         content,
         transport,
         created_at            AS "createdAt"
       FROM chat_history
       WHERE activity_state_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [activityStateId, limit]
    );
    console.log(`📜 loadChatHistory: fetched ${res.rows.length} turns for activityStateId=${activityStateId}`);
    return res.rows.reverse();
  } finally {
    await client.end();
  }
}

/**
 * Record an incoming (player) message into chat_history.
 * @param ctx Full MessageContext for this incoming message
 */
export async function recordIncoming(ctx: MessageContext): Promise<void> {
  if (!ctx.activity?.state?.id) {
    console.log(`⚠️ chatHistory: skip incoming, no activityStateId`);
    return;
  }
  const client = getDbClient();
  await client.connect();
  console.log(`📝 chatHistory: incoming activityStateId=${ctx.activity?.state?.id} from=${ctx.character.id} to=${ctx.npcCharacter?.id || '[]'} content="${ctx.text}" transport=${ctx.channel}`);
  try {
    await client.query(
      `INSERT INTO chat_history
         (activity_state_id, from_character_id, to_character_ids, role, content, transport)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        ctx.activity?.state?.id ?? null,
        ctx.character.id,
        ctx.npcCharacter ? [ctx.npcCharacter.id] : [],
        'user',
        ctx.text ?? '',
        ctx.channel,
      ]
    );
  } finally {
    await client.end();
  }
}

/**
 * Record an outgoing (agent) message into chat_history.
 * @param ctx Full MessageContext for this outgoing trigger
 * @param trig OutgoingTrigger being sent
 */
export async function recordOutgoing(
  ctx: MessageContext,
  trig: OutgoingTrigger
): Promise<void> {
  if (!ctx.activity?.state?.id) {
    console.log(`⚠️ chatHistory: skip outgoing, no activityStateId`);
    return;
  }
  const client = getDbClient();
  await client.connect();
  console.log(`📝 chatHistory: outgoing activityStateId=${ctx.activity?.state?.id} from=${ctx.npcCharacter?.id || ctx.character.id} to=${ctx.character.id} content="${trig.message}" transport=${trig.channel}`);
  try {
    await client.query(
      `INSERT INTO chat_history
         (activity_state_id, from_character_id, to_character_ids, role, content, transport)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        ctx.activity?.state?.id ?? null,
        ctx.npcCharacter?.id ?? ctx.character.id,
        [ctx.character.id],
        'assistant',
        trig.message,
        trig.channel,
      ]
    );
  } finally {
    await client.end();
  }
}


/**
 * Represents a row in the "players" table.
 */
export interface Player {
  /** Unique identifier for the player */
  id: string;
  /** Human-readable name or handle for the player */
  display_name?: string;
  /** When this player record was created */
  createdAt: Date;
}

/**
 * Represents a row in the "player_transports" table.
 */
export interface PlayerTransport {
  /** The player ID this transport belongs to */
  playerId: string;
  /** Transport type, e.g. 'signal', 'discord' */
  transport: string;
  /** Address or identifier on that transport */
  address: string;
  /** When this transport was added */
  createdAt: Date;
}
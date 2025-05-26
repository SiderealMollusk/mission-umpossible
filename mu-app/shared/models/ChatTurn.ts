import { ChatRole } from '../types';

/**
 * Represents a single chat history entry for a character.
 */
export interface ChatTurn {
  /** Auto-generated unique identifier for the chat entry */
  id: number;

  /** UUID of the activity_state this turn belongs to */
  activityStateId: string;

  /** Corresponding character's UUID who sent the message */
  fromCharacterId: string;

  /** List of recipient character UUIDs */
  toCharacterIds: string[];

  /** Who sent the message: user or assistant */
  role: ChatRole;

  /** The text content of the message */
  content: string;

  /** The transport channel used (e.g., 'signal', 'discord') */
  transport: string;

  /** Timestamp when the message was created */
  createdAt: string; // ISO timestamp
}
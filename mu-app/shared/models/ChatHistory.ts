

import { ChatRole } from '../types';

/**
 * Represents a single chat history entry for a character.
 */
export interface ChatHistory {
  /** Auto-generated unique identifier for the chat entry */
  id: number;

  /** Corresponding character's UUID */
  characterId: string;

  /** Who sent the message: user or assistant */
  role: ChatRole;

  /** The text content of the message */
  content: string;

  /** Timestamp when the message was created */
  createdAt: string; // ISO timestamp
}
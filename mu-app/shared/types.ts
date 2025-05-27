import { Player } from './models/Player';
import { Character } from './models/Character';
import { Activity } from './models/Activity';
import { ActivityState } from './models/ActivityState';

/**
 * Generic action function.
 * @param arg The action-specific payload.
 * @param ctx The full MessageContext for this message.
 */
export type ActionFn<Arg = any> = (
  arg: Arg,
  ctx: MessageContext
) => Promise<OutgoingTrigger[] | void>;

// Chat-turn support
export type ChatRole = 'system' | 'user' | 'assistant';

/** One turn in a conversation: user or assistant. */
export interface ChatTurn {
  role: ChatRole;
  text: string;
}


// DTOs for message handling pipeline

/**
 * Represents a single incoming message from any transport.
 */
export interface IncomingMessage {
  channel: 'signal' | 'discord';
  source: string;               // phone number or user ID
  text?: string;                // message text if present
  typing?: 'started' | 'stopped'; // typing events
  attachments?: Attachment[];   // media attachments
  timestamp: number;            // epoch millis
  raw: any;                     // original envelope payload
}

/**
 * Represents a file or media attachment.
 */
export interface Attachment {
  id: string;                   // attachment identifier
  contentType?: string;         // MIME type if known
  filename?: string;            // original filename if known
  size?: number;                // size in bytes
  data?: any;                   // raw or reference to content
}

/**
 * Represents a standardized outgoing trigger for any transport.
 */
export interface OutgoingTrigger {
  channel: 'signal' | 'discord';
  to: string;                   // destination address or ID
  message: string;              // text to send
  attachments?: Attachment[];   // media attachments to send
}

/**
 * Represents a fully enriched message context for business logic.
 */
export interface MessageContext {
  player: Player;
  character: Character;
  /**
   * Current activity context for this message.
   */
  activity?: {
    /** The activity definition/spec from the database */
    definition: Activity;
    /** The persisted state for this character's activity */
    state?: ActivityState;
  };
  npcCharacter?: Character;
  channel: IncomingMessage['channel'];
  source: IncomingMessage['source'];
  text?: IncomingMessage['text'];
  typing?: IncomingMessage['typing'];
  attachments?: IncomingMessage['attachments'];
  conversationHistory?: ChatTurn[]; //might not get used?
  transcript?: string;
  /**
   * Results returned by any called tools in this turn.
   */
  toolResults?: Record<string, any>;

  /**
   * Indicates whether the activity is marked as finished (e.g., consent given).
   */
  isFinished?: boolean;
  timestamp: IncomingMessage['timestamp'];
  raw: any;
}

import { Player } from './models/Player';
import { Character } from './models/Character';
import { ActivityState } from './models/ActivityState';
import { Activity } from './models/Activity';


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
  activityState?: ActivityState;
  activity?: Activity;
  npcCharacter?: Character;
  channel: IncomingMessage['channel'];
  source: IncomingMessage['source'];
  text?: IncomingMessage['text'];
  typing?: IncomingMessage['typing'];
  attachments?: IncomingMessage['attachments'];
  timestamp: IncomingMessage['timestamp'];
  raw: any;
}
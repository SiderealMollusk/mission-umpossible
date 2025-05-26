/**
 * Represents a row in the "characters" table.
 */
export interface Character {
  /** Unique identifier for the character */
  id: string;
  /** Display name of the character */
  name: string;
  /** Species of the character (nullable) */
  species: string | null;
  /** Narrative backstory for the character (nullable) */
  backstory: string | null;
  /** Roleplay notes (nullable) */
  rpNotes: string | null;
  /** Timestamp when the character was created */
  createdAt: Date;
}

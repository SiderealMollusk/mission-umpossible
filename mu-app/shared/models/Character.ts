/**
 * Represents a row in the "characters" table.
 */
export interface Character {
  /** Unique identifier for the character */
  id: string;
  /** Display name of the character */
  name: string;
  /** JSON blob of character attributes or stats */
  attributes: Record<string, any>;
  /** Timestamp when the character was created */
  createdAt: Date;
}

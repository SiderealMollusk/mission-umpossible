

/**
 * Represents a row in the "activity_states" table.
 */
export interface ActivityState {
  /** Unique identifier for this state record */
  id: string;
  /** The character this state belongs to */
  characterId: string;
  /** The activity that this state refers to */
  activityId: string;
  /** Arbitrary JSON payload holding state-specific data */
  payload: Record<string, any>;
  /** When this state record was created */
  createdAt: Date;
}
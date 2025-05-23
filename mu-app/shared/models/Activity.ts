

import { ActivitySpec as Spec } from './Activity_Spec';

/**
 * Represents a row in the "activities" table.
 */
export interface Activity {
  /** Unique identifier for the activity */
  id: string;
  /** Human-readable name of the activity */
  name: string;
  /** Description of the activity */
  description: string;
  /** JSON specification defining triggers and steps */
  spec: Spec;
  /** Timestamp when this activity was created */
  createdAt: Date;
}
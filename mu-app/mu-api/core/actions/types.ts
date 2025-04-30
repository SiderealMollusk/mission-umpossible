


/**
 * SendMessageArg defines the two supported forms for sending a message action.
 * - literal: directly specify the message string.
 * - prompt: provide a prompt and (optionally) context for LLM generation.
 */
export type SendMessageArg =
  | {
      literal: string;
      to?: string;
      channels: string[];
    }
  | {
      prompt: string;
      context?: any;
      to?: string;
      channels: string[];
    };

/**
 * ActionContext defines the runtime environment available to each action handler.
 * This context is passed alongside the static `arg` from the activity spec.
 * It provides shared metadata about the execution context (who, what, where).
 */
export interface ActionContext {
  /**
   * The ID of the activity being executed.
   * Useful for logging, tracing, or context-aware behaviors.
   */
  activity_id: string;

  /**
   * The ID of the player associated with this execution context, if any.
   * Optional because not all actions require or are associated with a player.
   */
  player_id?: string;

  /**
   * The ID of the character associated with this execution context, if relevant.
   */
  character_id?: string;

  /**
   * The communication transport involved in this context (e.g., 'signal', 'discord').
   * Optional — may be used for transport-specific routing.
   */
  transport?: string;

  /**
   * You may extend this interface dynamically to include
   * any other fields needed by your system, such as session ID, attempt count, etc.
   */
  [key: string]: any;
}

/**
 * ActionFn defines the structure of an action handler function.
 * Now supports generics so individual handlers can declare their argument type.
 * Each action receives its configured argument (`arg`) and the current runtime context (`ctx`).
 * The handler should return a Promise and may perform async work like messaging or DB writes.
 */
export type ActionFn<TArg = any> = (arg: TArg, ctx: ActionContext) => Promise<void>;


/**
 * ILogger port interface.
 * Defines structured logging methods for use-cases and core services.
 */
export interface ILogger {
  /**
   * Log an informational message.
   * @param meta Structured metadata key-value pairs.
   * @param message Human-readable log message.
   */
  info(meta: Record<string, unknown>, message: string): void;

  /**
   * Log a warning message.
   * @param meta Structured metadata key-value pairs.
   * @param message Human-readable log message.
   */
  warn(meta: Record<string, unknown>, message: string): void;

  /**
   * Log an error message.
   * @param meta Structured metadata key-value pairs.
   * @param message Human-readable log message.
   */
  error(meta: Record<string, unknown>, message: string): void;

  /**
   * Log a debug message.
   * @param meta Structured metadata key-value pairs.
   * @param message Human-readable log message.
   */
  debug(meta: Record<string, unknown>, message: string): void;
}
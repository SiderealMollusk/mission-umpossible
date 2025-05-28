import { z } from 'zod';

/**
 * Schema for the PingCommand.
 * Accepts an optional clientId to track callers.
 */
export const PingCommandSchema = z
  .object({
    echo: z.string().optional(),
    clientId: z.string().uuid().optional(),
    version: z.literal(1),
  })
  .strict();

/**
 * TypeScript type for PingCommand, inferred from the schema.
 */
export type PingCommand = z.infer<typeof PingCommandSchema>;
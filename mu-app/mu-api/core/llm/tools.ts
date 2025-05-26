/**
 * detectConsent
 * Determines whether the user message indicates consent.
 * @param args.userMessage The raw text the player just sent.
 * @returns An object with a boolean `consent` field.
 */
export function detectConsent(args: { userMessage: string }): { consent: boolean } {
  const { userMessage } = args;
  // Simple placeholder logic: check for explicit affirmative phrases.
  const affirmative = /\b(yes|sure|ok|okay|yep|i consent|i agree)\b/i;
  const consent = affirmative.test(userMessage);
  return { consent };
}



/**
 * JSON-schema declaration for the "detectConsent" tool.
 */
export const detectConsentDefinition = {
  name: 'detectConsent',
  description: 'Look at the player’s latest message and answer yes or no if they just gave consent.',
  parameters: {
    type: 'object',
    properties: {
      userMessage: {
        type: 'string',
        description: 'The raw text the player just sent.'
      }
    },
    required: ['userMessage']
  }
} as const;

/**
 * Map of tool implementations.
 */
export const toolImplementations = {
  detectConsent
};

/**
 * Array of all function declarations to pass to the LLM.
 */
export const toolDefinitions = [
  detectConsentDefinition
] as const;
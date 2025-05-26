import { GoogleGenAI } from '@google/genai';
import type { MessageContext, OutgoingTrigger } from '../../shared/types';
import { loadChatHistory } from './llm/chatHistory';

// Initialize Google Gemini client with API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



/**
 * Core chat logic for an initialized activity.
 */
export async function characterChatResponse(
  ctx: MessageContext
): Promise<OutgoingTrigger[]> {
  // Load full chat history for this activity
  const history = ctx.activity?.state?.id
    ? await loadChatHistory(ctx.activity.state.id, 1000)
    : [];
  // Serialize turns into a transcript
  const transcript = history
    .map(turn => {
      const speaker = turn.fromCharacterId === ctx.character.id
        ? ctx.character.name
        : ctx.npcCharacter?.name || 'NPC';
      return `${speaker}: ${turn.content}`;
    })
    .join('\n');

  // Build a formatted prompt from the context (simplified for now)
  const prompt = `
Chat history:
${transcript}

You are an NPC in a text-based RPG. Use Markdown formatting for your replies.
Player said: "${ctx.text}"
Respond as the character ${ctx.npcCharacter?.name || 'Unknown'} with a fully formatted message.
`;
  // Call Gemini to generate the response
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  // The SDK returns the generated text on `result.text`
  const message = (result.text || '').trim();
  return [
    {
      channel: ctx.channel,
      to:      ctx.source,
      message,
    },
  ];
}
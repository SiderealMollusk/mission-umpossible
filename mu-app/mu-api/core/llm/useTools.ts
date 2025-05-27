import { GoogleGenAI, Type } from '@google/genai';
import type { MessageContext } from '../../../shared/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Define a response schema for structured output
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isHappy: { type: Type.BOOLEAN },
    isLate: { type: Type.BOOLEAN },
  },
  required: ['isHappy', 'isLate'],
} as const;

export async function analyzeUserAffectAndTimeliness(text: string): Promise<{ isHappy: boolean; isLate: boolean }> {
  const prompt = `
Analyze the following user message for two things:
1. Is the user's affect best categorized as "happy"?
2. Is the user running late, behind schedule, or delayed?

Return your answer as a JSON object with two boolean fields: "isHappy" and "isLate".

User message: "${text}"
`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  let parsed: { isHappy: boolean; isLate: boolean };
  try {
    parsed = JSON.parse(result.text ?? '');
  } catch (e) {
    throw new Error('Failed to parse JSON from Gemini: ' + e);
  }

  if (typeof parsed.isHappy !== 'boolean' || typeof parsed.isLate !== 'boolean') {
    throw new Error('Parsed response does not contain valid boolean fields');
  }

  console.log(`isHappy: ${parsed.isHappy}`);
  console.log(`isLate: ${parsed.isLate}`);
  return { isHappy: parsed.isHappy, isLate: parsed.isLate };
}

export async function useTools(ctx: MessageContext): Promise<void> {
  const text = ctx.text ?? '';
  const { isHappy, isLate } = await analyzeUserAffectAndTimeliness(text);
  ctx.toolResults = { isHappy, isLate };
}

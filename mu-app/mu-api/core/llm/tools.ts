import { GoogleGenAI, Type } from '@google/genai';
import type { MessageContext } from '../../../shared/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Tool 1: Analyze if user is happy
const affectSchema = {
  type: Type.OBJECT,
  properties: {
    isHappy: { type: Type.BOOLEAN },
  },
  required: ['isHappy'],
} as const;

export async function analyzeUserAffect(text: string): Promise<{ isHappy: boolean }> {
  const prompt = `
Analyze the following user message:
Is the user's affect best categorized as "happy"?

Return your answer as a JSON object with one boolean field: "isHappy".

User message: "${text}"
`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: affectSchema,
    },
  });

  let parsed: { isHappy: boolean };
  try {
    parsed = JSON.parse(result.text ?? '');
  } catch (e) {
    throw new Error('Failed to parse JSON from Gemini: ' + e);
  }

  if (typeof parsed.isHappy !== 'boolean') {
    throw new Error('Parsed response does not contain valid boolean fields');
  }

  return { isHappy: parsed.isHappy };
}

// Tool 2: Analyze if user is late
const timelinessSchema = {
  type: Type.OBJECT,
  properties: {
    isLate: { type: Type.BOOLEAN },
  },
  required: ['isLate'],
} as const;

// Tool 3: Detect if user gave consent
const consentSchema = {
  type: Type.OBJECT,
  properties: {
    consent: { type: Type.BOOLEAN },
  },
  required: ['consent'],
} as const;

export async function analyzeUserTimeliness(text: string): Promise<{ isLate: boolean }> {
  const prompt = `
Analyze the following user message:
Is the user running late, behind schedule, or delayed?

Return your answer as a JSON object with one boolean field: "isLate".

User message: "${text}"
`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: timelinessSchema,
    },
  });

  let parsed: { isLate: boolean };
  try {
    parsed = JSON.parse(result.text ?? '');
  } catch (e) {
    throw new Error('Failed to parse JSON from Gemini: ' + e);
  }

  if (typeof parsed.isLate !== 'boolean') {
    throw new Error('Parsed response does not contain valid boolean fields');
  }

  return { isLate: parsed.isLate };
}

export async function detectConsent(text: string): Promise<{ consent: boolean }> {
  const prompt = `
Analyze the following user message:
Does the user’s message indicate explicit consent or agreement?

Return your answer as a JSON object with one boolean field: "consent".

User message: "${text}"
`;
  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: consentSchema,
    },
  });
  let parsed: { consent: boolean };
  try {
    parsed = JSON.parse(result.text ?? '');
  } catch (e) {
    throw new Error('Failed to parse JSON from Gemini: ' + e);
  }
  if (typeof parsed.consent !== 'boolean') {
    throw new Error('Parsed response does not contain valid boolean fields');
  }
  return { consent: parsed.consent };
}

// Orchestrator: Calls both tools and returns results as an array
export async function useTools(ctx: MessageContext): Promise<void> {
  const text = ctx.text ?? '';
  const [affect, timeliness, consent] = await Promise.all([
    analyzeUserAffect(text),
    analyzeUserTimeliness(text),
    detectConsent(text),
  ]);
  console.log("user is happy: "+ affect.isHappy);
  console.log("user is late: "+ timeliness.isLate);
  console.log("user consent: " + consent.consent);
  ctx.toolResults = [affect, timeliness, consent];
}

// Dictionary of tool functions for dynamic invocation
export const toolsMap: Record<string, (text: string) => Promise<any>> = {
  analyzeUserAffect,
  analyzeUserTimeliness,
  detectConsent,
};

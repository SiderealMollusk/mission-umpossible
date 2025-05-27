import { GoogleGenAI } from '@google/genai';
import type { MessageContext, OutgoingTrigger } from '../../shared/types';
import { loadChatHistory } from './llm/chatHistory';
import { buildSystemMessages } from '../core/llm/buildSystemMessage';
import { toolsMap, meetsCriteria } from './llm/chatAnalysis';


// Initialize Google Gemini client with API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



/**
 * Core chat logic for an initialized activity.
 */
export async function characterChatResponse(

//PHASE 1 FETCH HISTORY
  ctx: MessageContext
): Promise<OutgoingTrigger[]> {
  // Build system-level instructions based on context
  const systemMessages = buildSystemMessages(ctx);
  const systemPrompt = systemMessages.join('\n') + '\n';

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
ctx.transcript = transcript;
//PHASE 2 MAKE TOOL CALLS (populate ctx.toolResults)
//await useTools(ctx); works as an example, but until I know what I want better it remains just that.

//PHASE 3 CHECK IF ACTIVITY FINISHED
const to_finish = ctx.activity?.definition.spec.to_finish;
if (!to_finish) {
  throw new Error('No to_finish criteria defined on ActivitySpec');
}
const { meets } = await meetsCriteria(transcript, to_finish);
if(meets){
  console.log("✨ Detected activity finished in chatResponse ✨")
  ctx.isFinished = true;
} else {
  console.log("✨ Activity not complete, continuing chat ✨")
}

//PHASE 4 GENERATE NARRITIVE RESPONSE
  const prompt = `
${systemPrompt}
Chat history:
${transcript}

Player said: "${ctx.text}"
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
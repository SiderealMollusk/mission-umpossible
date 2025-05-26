import type { MessageContext } from '../../../shared/types';

/**
 * Build global system messages for the LLM based on the current context.
 * @param ctx The enriched message context containing player, character, and activity.
 * @returns An array of system-level instructions for the LLM.
 */
export function buildSystemMessages(ctx: MessageContext): string[] {
  const npcName = ctx.npcCharacter?.name ?? 'Unknown';
  const persona = `You are **${npcName}**, ${ctx.npcCharacter?.backstory ?? 'a mysterious entity'}. ${ctx.npcCharacter?.rpNotes ?? ''}`.trim();
  const playerName = ctx.player.display_name;
  const activityDesc = ctx.activity?.definition.description ?? 'an ongoing situation';
  const situation = `The player, ${playerName}, is currently in the following activity: ${activityDesc}.`;
  const instructions = ctx.activity?.definition.spec.instructions;
  const instructMsg = instructions
    ? `Instructions: ${instructions}`
    : 'Follow the context and respond appropriately.';
  return [persona, situation, instructMsg];
}
import { sendViaSignal } from './senderSignal';
//import { sendViaDiscord } from './actions/send_message_discord'; // assume this will exist
import { OutgoingTrigger } from '../../shared/types';

export async function sendTriggers(triggers: OutgoingTrigger[]): Promise<
  Array<{ channel: string; to: string; ok: boolean; status?: number; error?: any }>
> {
  console.log(`Dispatching ${triggers.length} outgoing trigger(s)`);
  const results: Array<{ channel: string; to: string; ok: boolean; status?: number; error?: any }> = [];
  for (const trig of triggers) {
    console.log(`[${trig.channel.toUpperCase()}] to ${trig.to}: "${trig.message}"`);
    if (trig.attachments && trig.attachments.length > 0) {
      console.log('   📎 Attachments:', JSON.stringify(trig.attachments, null, 2));
    }

    try {
      switch (trig.channel) {
        case 'signal':
          console.log(' *** I WOULD SAY: ' + trig.message);
          const result = await sendViaSignal({ to: trig.to, message: trig.message });
          if (!result.ok) {
            console.error(`   ❌ sendViaSignal failed:`, result.error ?? result);
          } else {
            console.log(`   ✅ sendViaSignal success (status ${result.status})`);
          }
          results.push({ channel: trig.channel, to: trig.to, ok: result.ok, status: result.status, error: result.error });
          break;
        /*
        case 'discord':
          console.log('   Sending via Discord...');
          await sendViaDiscord({ to: trig.to, message: trig.message, attachments: trig.attachments });
          break;
        */
        default:
          console.warn(`   ⚠️ Unknown channel "${trig.channel}", skipping`);
          results.push({ channel: trig.channel, to: trig.to, ok: false, error: `Unknown channel` });
          break;
      }
      console.log(`   Sent trigger to ${trig.channel}`);
    } catch (err) {
      console.error(`   ❌ Error sending trigger to ${trig.channel}:`, err);
      // Optionally: collect failures for retries or alerts
    }
  }
  console.log('sendTriggers completed');
  return results;
}

// TODO: implement sendViaDiscord adapter in ./actions/send_message_discord.ts

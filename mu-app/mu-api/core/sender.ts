import { sendViaSignal } from './actions/send_message_signal';
//import { sendViaDiscord } from './actions/send_message_discord'; // assume this will exist
import { OutgoingTrigger } from '../../shared/types';

export async function sendTriggers(triggers: OutgoingTrigger[]): Promise<void> {
  console.log(`Dispatching ${triggers.length} outgoing trigger(s)`);
  for (const trig of triggers) {
    console.log(`[${trig.channel.toUpperCase()}] to ${trig.to}: "${trig.message}"`);
    if (trig.attachments && trig.attachments.length > 0) {
      console.log('   📎 Attachments:', JSON.stringify(trig.attachments, null, 2));
    }

    try {
      switch (trig.channel) {
        case 'signal':
          console.log(' *** I WOULD SAY: ' + trig.message);
          await sendViaSignal({ to: trig.to, message: trig.message });
          break;
        /*
        case 'discord':
          console.log('   Sending via Discord...');
          await sendViaDiscord({ to: trig.to, message: trig.message, attachments: trig.attachments });
          break;
        */
        default:
          console.warn(`   ⚠️ Unknown channel "${trig.channel}", skipping`);
      }
      console.log(`   Sent trigger to ${trig.channel}`);
    } catch (err) {
      console.error(`   ❌ Error sending trigger to ${trig.channel}:`, err);
      // Optionally: collect failures for retries or alerts
    }
  }
  console.log('sendTriggers completed');
}

// TODO: implement sendViaDiscord adapter in ./actions/send_message_discord.ts

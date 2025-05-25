import fetch from 'node-fetch';

const SIGNAL_API = process.env.SIGNAL_API;
const SIGNAL_NUMBER = process.env.SIGNAL_NUMBER;
const MU_API_URL = process.env.MU_API_URL;
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '3000', 10);

let shouldStop = false;
process.on('SIGINT', () => { console.log('exiting'); shouldStop = true; });
process.on('SIGTERM', () => { console.log('exiting'); shouldStop = true; });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchMessages() {
  const res = await fetch(`${SIGNAL_API}/v1/receive/${SIGNAL_NUMBER}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function pollLoop() {
  console.log('starting');
  while (!shouldStop) {
    try {
      // Fetch messages without deleting
      const messages = await fetchMessages();
      console.log(`found on fetch ${messages.length} envelopes`);
      messages.forEach((env, idx) => {
        const envelope = env.envelope || env;
        // Determine from and to (to is our SIGNAL_NUMBER)
        const from = envelope.source || envelope.sourceNumber || 'unknown';
        const to = SIGNAL_NUMBER;
        // Determine type and message text
        let type = 'unknown';
        let messageText = '';
        if (envelope.dataMessage) {
          type = 'message';
          messageText = envelope.dataMessage.message;
        } else if (envelope.typingMessage) {
          type = 'typing';
        } else if (envelope.attachments) {
          type = 'attachment';
        } else if (envelope.receiptMessage) {
          type = 'receipt';
        }
        // Determine status if a receipt
        const status = envelope.receiptMessage
          ? envelope.receiptMessage.isDelivery ? 'delivered' : 'unknown'
          : 'n/a';
        console.log(
          `envelope${idx + 1}: from=${from}, to=${to}, type=${type}, message="${messageText}", status=${status}`
        );
      });

      // Forward actual message envelopes to the application
      const toForward = messages.filter(env => {
        const envelope = env.envelope || env;
        return Boolean(envelope.dataMessage);
      });
      if (toForward.length > 0) {
        console.log(`forwarding ${toForward.length} message(s) to ${MU_API_URL}`);
        try {
          await fetch(MU_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toForward),
          });
        } catch (err) {
          console.error('error forwarding messages:', err);
        }
      }
    } catch (err) {
      console.error('poll error:', err);
      console.error(err.stack);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  pollLoop();
}
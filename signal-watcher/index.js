import fetch from 'node-fetch';

const SIGNAL_API = process.env.SIGNAL_API;
const SIGNAL_NUMBER = process.env.SIGNAL_NUMBER;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const [minDelay, maxDelay] = process.env.DELAY_RANGE.split(',').map(Number);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function receiveMessages() {
  const res = await fetch(`${SIGNAL_API}/v1/receive/${SIGNAL_NUMBER}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

export function delayForHuman() {
  return Math.floor(Math.random() * (maxDelay - minDelay) + minDelay) * 1000;
}

export async function sendToWebhook(msg) {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify(msg),
  });

  const resultText = await res.text();
  console.log(`🌐 webhook response [${res.status}]: ${resultText}`);
}

async function pollLoop() {
  while (true) {
    try {
      const messages = await receiveMessages();
      if (Array.isArray(messages)) {
        for (const msg of messages) {
          //const d = delayForHuman(); for now.
          //await sleep(d);
          console.log('📦 RECEIVED MESSAGE BATCH:\n');
          const envelope = msg.envelope || {};
          const source = envelope.source || msg.source || '[unknown]';
          const text = envelope.dataMessage?.message;
          const typingAction = envelope.typingMessage?.action;
          if (typingAction === 'STARTED') {
            console.log(`✍️🟢 ${source} writing...`);
            try {
              await sendToWebhook({ type: 'typing_start', source });
              console.log(`📤 forwarded typing start from ${source}`);
            } catch (err) {
              console.error('❌ webhook failed:', err.stack || err.message);
            }
          } else if (typingAction === 'STOPPED') {
            console.log(`✍️🏁 ${source} stopped`);
            try {
              await sendToWebhook({ type: 'typing_stop', source });
              console.log(`📤 forwarded typing stop from ${source}`);
            } catch (err) {
              console.error('❌ webhook failed:', err.stack || err.message);
            }
          } else if (text) {
            console.log(`📤 ${source} sent: "${text}"`);
            try {
              await sendToWebhook({ type: 'message', source, text });
              console.log(`📤 forwarded message from ${source}: "${text}"`);
            } catch (err) {
              console.error('❌ webhook failed:', err.stack || err.message);
            }
          }
        }
      }
    } catch (err) {
      console.error('watcher:', err.message);
    }
    await sleep(3000);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  pollLoop();
}
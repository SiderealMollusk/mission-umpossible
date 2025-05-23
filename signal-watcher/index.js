import fetch from 'node-fetch';

const SIGNAL_API = process.env.SIGNAL_API;
const SIGNAL_NUMBER = process.env.SIGNAL_NUMBER;
const MU_API_URL = process.env.MU_API_URL;
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '3000', 10);

let shouldStop = false;
process.on('SIGINT', () => { console.log('exiting'); shouldStop = true; });
process.on('SIGTERM', () => { console.log('exiting'); shouldStop = true; });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function receiveMessages() {
  const res = await fetch(`${SIGNAL_API}/v1/receive/${SIGNAL_NUMBER}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function pollLoop() {
  console.log('starting');
  while (!shouldStop) {
    try {
      const messages = await receiveMessages();
      if (Array.isArray(messages) && messages.length > 0) {
        console.log(`batch size: ${messages.length}, forwarding to ${MU_API_URL}`);
        await fetch(MU_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messages)
        });
        // Acknowledge & remove all processed messages from the signal-cli queue
        await fetch(`${SIGNAL_API}/v1/receive/${SIGNAL_NUMBER}`, {
          method: 'DELETE'
        });
        console.log(`cleared ${messages.length} messages from signal-cli queue`);
      } else {
        console.log('polled');
      }
    } catch (err) {
      console.error('poll error:', err.message);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  pollLoop();
}
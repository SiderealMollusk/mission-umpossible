import fetch from 'node-fetch';

const SIGNAL_API = process.env.SIGNAL_API;
const SIGNAL_NUMBER = process.env.SIGNAL_NUMBER;
const MU_API_URL = process.env.MU_API_URL;
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '3000', 10);

let shouldStop = false;
process.on('SIGINT', () => { console.log('exiting'); shouldStop = true; });
process.on('SIGTERM', () => { console.log('exiting'); shouldStop = true; });

// Track seen message UUIDs to avoid reprocessing
const seenUuids = new Set();
const uuidQueue = [];
const MAX_CACHE = 1000;

function markSeen(uuid) {
  if (!seenUuids.has(uuid)) {
    seenUuids.add(uuid);
    uuidQueue.push(uuid);
    if (uuidQueue.length > MAX_CACHE) {
      const old = uuidQueue.shift();
      seenUuids.delete(old);
      console.log(`[watcher] evicted old UUID ${old} from cache`);
    }
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function receiveMessages() {
  const res = await fetch(`${SIGNAL_API}/v1/receive/${SIGNAL_NUMBER}?delete=true`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function pollLoop() {
  console.log('starting');
  while (!shouldStop) {
    try {
      let messages;
      try {
        messages = await receiveMessages();
      } catch (err) {
        console.error('error receiving messages:', err);
        await sleep(POLL_INTERVAL_MS);
        continue;
      }
      console.log(`[watcher] first fetch returned ${messages.length} envelopes`);
      if (Array.isArray(messages) && messages.length > 0) {
        // Deduplicate by sourceUuid
        const unique = [];
        for (const env of messages) {
          const uuid = env.envelope?.sourceUuid;
          if (uuid && seenUuids.has(uuid)) {
            console.log(`[watcher] DEDUPED envelope id=${uuid}`);
            continue;
          }
          if (uuid) markSeen(uuid);
          unique.push(env);
        }
        if (unique.length !== messages.length) {
          console.log(`[watcher] ${messages.length - unique.length} duplicates dropped`);
        }
        // Log each unique envelope
        for (const env of unique) {
          const sender = env.envelope?.source || env.envelope?.sourceNumber;
          let type = 'unknown', msg = '';
          if (env.envelope?.dataMessage) {
            type = 'message'; 
            msg = env.envelope.dataMessage.message;
          } else if (env.envelope?.typingMessage) {
            type = 'typing';
          } else if (env.envelope?.attachments) {
            type = 'attachment';
          } else if (env.envelope?.receiptMessage) {
            type = 'receipt';
          }
          const action = (type === 'message') ? 'FORWARDED' : 'SKIPPED';
          const id = env.envelope?.sourceUuid;
          console.log(`[watcher] to=${MU_API_URL} from=${sender} id=${id} type=${type} msg="${msg}" action=${action}`);
        }
        // Filter to only actual incoming user messages
        const filtered = unique.filter(env => !!env.envelope?.dataMessage);
        if (filtered.length > 0) {
          console.log(`batch size: ${filtered.length} (filtered out ${unique.length - filtered.length}), forwarding to ${MU_API_URL}`);
          try {
            await fetch(MU_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(filtered)
            });
          } catch (err) {
            console.error('error forwarding to MU_API:', err);
          }
        } else {
          console.log(`batch size: ${unique.length} but none forwarded (all from bot)`);
        }
        // Allow Signal API to delete before flush
        await sleep(100);
        // Flush leftover events
        const leftover = await receiveMessages();
        console.log(`[watcher] flush fetch returned ${leftover.length}`);
        if (leftover.length > 0) {
          const ids = leftover.map(env => env.envelope?.sourceUuid).join(',');
          console.log(`[watcher] FLUSHED leftover IDs: ${ids}`);
        }
        console.log('flushed leftover events');
      } else {
        console.log('polled');
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
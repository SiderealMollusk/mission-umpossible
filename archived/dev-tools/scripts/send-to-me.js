

import fetch from 'node-fetch';

const SIGNAL_API = process.env.SIGNAL_API || 'http://localhost:8756';
const FROM = process.env.SIGNAL_FROM || '+15107302276';
const TO = process.env.SIGNAL_TO || '+15103818246';  // send to self

const message = `[o¿o] :: Self-ping successful.\nSignal API operational at ${new Date().toISOString()}`;

const payload = {
  message,
  number: FROM,
  recipients: [TO],
};

fetch(`${SIGNAL_API}/v2/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log('✅ Message sent:', data);
  })
  .catch(err => {
    console.error('❌ Failed to send message:', err.message);
  });
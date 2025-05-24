

import fetch from 'node-fetch';

export async function sendViaSignal({
  to,
  message,
}: {
  to: string;
  message: string;
}) {
  try {
    if (!process.env.SIGNAL_NUMBER) {
      console.error('[Signal Config Error] SIGNAL_NUMBER is undefined');
    }

    console.log('[Signal Debug] Sending message with payload:', {
      number: process.env.SIGNAL_NUMBER,
      recipients: [to],
      message,
    });

    const response = await fetch('http://signal-api:8080/v2/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        number: process.env.SIGNAL_NUMBER, // should be set in Docker env
        recipients: [to],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[Signal Error]', response.status, text);
    } else {
      console.log('[Signal] ✅ Message sent to', to);
    }
  } catch (err) {
    console.error('[Signal] ❌ Failed to send message:', err);
  }
}
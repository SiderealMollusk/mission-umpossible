import fetch from 'node-fetch';

export async function sendViaSignal({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<{ ok: boolean; status?: number; data?: any; error?: any }> {
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

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      console.error('[Signal Error]', response.status, data);
      return { ok: false, status: response.status, error: data };
    }
    console.log('[Signal] ✅ Message sent to', to);
    return { ok: true, status: response.status, data };
  } catch (err) {
    console.error('[Signal] ❌ Failed to send message:', err);
    return { ok: false, error: err };
  }
}
import { Router, Request, Response } from 'express';
import { IncomingMessage } from '../../shared/types';
import { dispatchIncoming } from '../core/dispatch';

const router = Router();

/**
 * POST /api/v1/webhooks/signal
 * Receives an array of incoming Signal envelopes, maps to DTOs, and dispatches.
 */
router.post('/', async (req: Request, res: Response) => {
  const rawEnvelopes = req.body;
  if (!Array.isArray(rawEnvelopes)) {
    return res.status(400).json({ error: 'Expected an array of envelopes' });
  }

  // Map raw envelopes to DTOs
  const batch: IncomingMessage[] = rawEnvelopes.map((env: any) => ({
    channel: 'signal',
    source: env.envelope?.source,
    text: env.envelope?.dataMessage?.message,
    typing: env.envelope?.typingMessage?.action?.toLowerCase() as 'started' | 'stopped',
    attachments: env.envelope?.attachments,
    timestamp: env.envelope?.timestamp,
    raw: env.envelope,
  }));

  try {
    await dispatchIncoming(batch);
    res.json({ success: true });
  } catch (err) {
    console.error('Dispatch error:', err);
    res.status(500).json({ error: 'Dispatch failed' });
  }
});

export default router;
import { Router } from 'express';
import onboard from './onboard';
import seedPlayer from './seedPlayer';
import receiveSignalMessage from './receiveSignalMessage';

// import other route modules as you add them

const router = Router();

// Versioned route groups
router.use('/onboard', onboard);
// router.use('/characters', characters);
// router.use('/players', players);
router.use('/players/seed', seedPlayer);

// Webhook endpoint for incoming Signal messages
router.use('/webhooks/signal', receiveSignalMessage);

export default router;
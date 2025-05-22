import { Router } from 'express';
import onboard from './onboard';
import seedPlayer from './seedPlayer';
import handleIncomingMessages from './handleIncomingMessages';
import { userInfo } from 'os';

// import other route modules as you add them

const router = Router();

// Versioned route groups
router.use('/onboard', onboard);
// router.use('/characters', characters);
// router.use('/players', players);
router.use('/players/seed', seedPlayer);

router.use('/internal/handleIncomingMessages', handleIncomingMessages);
export default router;
import { Router } from 'express';
import onboard from './onboard';
import seedPlayer from './seedPlayer';

// import other route modules as you add them

const router = Router();

// Versioned route groups
router.use('/onboard', onboard);
// router.use('/characters', characters);
// router.use('/players', players);
router.use('/players/seed', seedPlayer);

export default router;
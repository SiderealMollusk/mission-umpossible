import { Router } from 'express';
import onboard from './onboard';

// import other route modules as you add them

const router = Router();

// Versioned route groups
router.use('/onboard', onboard);
// router.use('/characters', characters);
// router.use('/players', players);

export default router;
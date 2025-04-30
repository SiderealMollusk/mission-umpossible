import { Router } from 'express';

const router = Router();

/**
 * POST /api/v1/onboard
 * Accepts an array of character_ids to onboard.
 * Currently logs the IDs; replace with real onboarding logic.
 */
router.post('/', (req, res) => {
  const { character_ids } = req.body;

  if (!Array.isArray(character_ids)) {
    return res.status(400).json({ error: 'character_ids must be an array' });
  }

  // TODO: Trigger onboarding logic here (e.g., create activity log, assign states)
  console.log("Onboarding characters:", character_ids);

  res.json({ success: true });
});

export default router;

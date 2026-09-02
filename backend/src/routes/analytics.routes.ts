import { Router } from 'express';

import { AnalyticsController } from '../controllers/analytics.contoller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

const controller =
  new AnalyticsController();

router.get(
  '/nifty',
  authenticate,
  controller.niftyComparison
);
router.get(
  '/chart',
  authenticate,
  controller.chart
);
router.get(
  '/allocation',
  authenticate,
  controller.allocation
);
router.get(
  '/performance',
  authenticate,
  controller.performance
);

export default router;
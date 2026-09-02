import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { BrokerController } from '../controllers/broker.controller';

const router = Router();

const brokerController =
  new BrokerController();

router.get(
  '/zerodha/login',
  authenticate,
  brokerController.getZerodhaLoginUrl
);

router.get(
  '/zerodha/callback',
  authenticate,
  brokerController.connectZerodha
);
router.get(
  '/zerodha/profile',
  authenticate,
  brokerController.profile
);
router.get(
  '/zerodha/holdings',
  authenticate,
  brokerController.holdings
);
router.get(
  '/status',
  authenticate,
  brokerController.status
);
export default router;
import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { PortfolioController } from '../controllers/portfolio.controller';

const router = Router();

const portfolioController =
  new PortfolioController();

router.get(
  '/current',
  authenticate,
  portfolioController.current
);

export default router;
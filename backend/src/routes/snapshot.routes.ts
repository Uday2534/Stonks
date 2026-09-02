// src/routes/snapshot.routes.ts

import { Router } from 'express';

import { authenticate } from '../middleware/auth.middleware';
import { SnapshotController } from '../controllers/snapshot.controller';

const router = Router();

const snapshotController =
  new SnapshotController();

router.post(
  '/generate',
  authenticate,
  snapshotController.generateSnapshot
);

router.get(
  '/history',
  authenticate,
  snapshotController.history
);
router.get(
  '/latest',
  authenticate,
  snapshotController.latest
);

export default router;
// src/routes/benchmark.routes.ts

import { Router } from 'express';

import { BenchmarkController } from '../controllers/benchmark.controller';
import { YahooFinanceProvider } from '../provider/YahooFinanceProvider';
import { BenchmarkService } from '../services/BenchmarkService';

const router = Router();

const controller =
  new BenchmarkController();

router.post(
  '/snapshot',
  controller.saveSnapshot
);

router.get(
  '/history/:benchmark',
  controller.history
);
router.get('/test', async (req, res) => {
  const provider =
    new YahooFinanceProvider();

  const value =
    await provider.getNiftyValue();

  res.json({ value });
});
router.post('/fetch', async (req, res) => {
  const service = new BenchmarkService();

  const snapshot =
    await service.saveDailyNiftySnapshot();

  res.json(snapshot);
});

export default router;
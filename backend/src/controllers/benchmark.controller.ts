// src/controllers/BenchmarkController.ts

import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { BenchmarkService } from '../services/BenchmarkService';

export class BenchmarkController {
  constructor(
    private readonly benchmarkService =
      new BenchmarkService()
  ) {}

  saveSnapshot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { benchmark, value } =
        req.body;

      const snapshot =
        await this.benchmarkService.saveSnapshot(
          benchmark,
          Number(value)
        );

      res.status(201).json(snapshot);
    } catch (error) {
      next(error);
    }
  };

  history = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const benchmark =
        String(req.params.benchmark);

      const days =
        Number(req.query.days ?? 30);

      const fromDate =
        new Date();

      fromDate.setDate(
        fromDate.getDate() - days
      );

      const history =
        await this.benchmarkService.getHistory(
          benchmark,
          fromDate,
          new Date()
        );

      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  };
}
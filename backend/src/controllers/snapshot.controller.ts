import { Request, Response, NextFunction } from 'express';

import prisma from '../prisma/client';
import AppError from '../utils/AppError';
import { SnapshotService } from '../services/SnapshotService';
import { PortfolioService } from '../services/PortfolioService';
import { ZerodhaClient } from '../integrations/zerodha/ZerodhaClient';
import env from '../config/env';

export class SnapshotController {
  constructor(
    private readonly snapshotService = new SnapshotService()
  ) {}

  generateSnapshot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const brokerAccount =
        await prisma.brokerAccount.findFirst({
          where: {
            userId: req.user.id,
          },
        });

      if (!brokerAccount) {
        throw new AppError(
          'Broker account not connected',
          404
        );
      }

      const client = new ZerodhaClient(
        env.zerodhaApiKey,
        brokerAccount.accessToken ?? undefined
      );

      const portfolioService =
        new PortfolioService(client);

      const snapshot =
        await portfolioService.generateSnapshot();

      const saved =
        await this.snapshotService.saveDailySnapshot({
          portfolioValue:
            snapshot.portfolioValue,
          investedValue:
            snapshot.investedValue,
          totalPnl:
            snapshot.totalPnl,
          dailyPnl:
            snapshot.dailyPnl,
          snapshotDate:
            snapshot.generatedAt,
          brokerAccountId:
            brokerAccount.id,
        });

      res.status(201).json(saved);
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
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const brokerAccount =
        await prisma.brokerAccount.findFirst({
          where: {
            userId: req.user.id,
          },
        });

      if (!brokerAccount) {
        throw new AppError(
          'Broker account not connected',
          404
        );
      }

      const history =
        await this.snapshotService.getPortfolioHistory(
          brokerAccount.id,
          new Date('2000-01-01'),
          new Date()
        );

      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  };
  latest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          'Unauthorized',
          401
        );
      }

      const snapshot =
        await this.snapshotService.getLatestSnapshot(
          req.user.id
        );

      res.status(200).json(snapshot);
    } catch (error) {
      next(error);
    }
  };
}
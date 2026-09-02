import {
  Request,
  Response,
  NextFunction,
} from 'express';

import prisma from '../prisma/client';
import AppError from '../utils/AppError';

import { AnalyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
  constructor(
    private readonly analyticsService =
      new AnalyticsService()
  ) {}

  niftyComparison = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError(
          'Unauthorized',
          401
        );
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

      const days = Number(
        req.query.days ?? 365
      );

      const result =
        await this.analyticsService.compareWithNifty(
          brokerAccount.id,
          days
        );

      res.status(200).json(
        result
      );
    } catch (error) {
      next(error);
    }
  };
  chart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError(
          'Unauthorized',
          401
        );
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

      const data =
        await this.analyticsService.getChartData(
          brokerAccount.id
        );

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  allocation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new AppError(
          'Unauthorized',
          401
        );
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

      if (
        !brokerAccount.accessToken
      ) {
        throw new AppError(
          'Access token missing',
          400
        );
      }

      const result =
        await this.analyticsService.getAssetAllocation(
          brokerAccount.accessToken
        );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  performance = async (
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

      const days = Number(
        req.query.days ?? 365
      );

      const result =
        await this.analyticsService.getPerformanceSeries(
          brokerAccount.id,
          days
        );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
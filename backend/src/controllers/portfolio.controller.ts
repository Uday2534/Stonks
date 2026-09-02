import { Request, Response, NextFunction } from 'express';

import prisma from '../prisma/client';
import AppError from '../utils/AppError';
import env from '../config/env';

import { ZerodhaClient } from '../integrations/zerodha/ZerodhaClient';
import { ZerodhaAdapter } from '../adapters/ZerodhaAdapter';
import { PortfolioService } from '../services/PortfolioService';

export class PortfolioController {
  current = async (
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
            broker: 'ZERODHA',
          },
        });

      if (!brokerAccount?.accessToken) {
        throw new AppError(
          'Zerodha account not connected',
          404
        );
      }

      const client = new ZerodhaClient(
        env.zerodhaApiKey,
        brokerAccount.accessToken
      );

      const adapter =
        new ZerodhaAdapter(client);

      const portfolioService =
        new PortfolioService(adapter);

      const portfolio =
        await portfolioService.getCurrentPortfolio();

      res.status(200).json(portfolio);
    } catch (error) {
      next(error);
    }
  };
}
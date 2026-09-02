import { Request, Response, NextFunction } from 'express';

import AppError from '../utils/AppError';
import { ZerodhaAuthService } from '../integrations/zerodha/ZerodhaAuthService';
import env from '../config/env';
import { ZerodhaClient } from '../integrations/zerodha/ZerodhaClient';
import prisma from '../prisma/client';

export class BrokerController {
  private readonly zerodhaAuthService =
    new ZerodhaAuthService(
      env.zerodhaApiKey,
      env.zerodhaApiSecret
    );

  getZerodhaLoginUrl = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginUrl =
        this.zerodhaAuthService.getLoginUrl();

      res.status(200).json({
        loginUrl,
      });
    } catch (error) {
      next(
        new AppError(
          'Failed to generate Zerodha login URL',
          500,
          error
        )
      );
    }
  };

  connectZerodha = async (
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

      const requestToken =
        req.query.request_token;

      if (
        typeof requestToken !== 'string'
      ) {
        throw new AppError(
          'Missing request_token',
          400
        );
      }

      const result =
        await this.zerodhaAuthService.connectBroker({
          requestToken,
          userId: req.user.id,
        });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  profile = async (
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
        await this.zerodhaAuthService.getBrokerAccount(
          req.user.id
        );

      if (!brokerAccount) {
        throw new AppError(
          'Zerodha account not connected',
          404
        );
      }

      const client =
        new ZerodhaClient(
          env.zerodhaApiKey,
          brokerAccount.accessToken ??
            undefined
        );

      const profile =
        await client.getProfile();

      res.status(200).json(profile);
    } catch (error: any) {
      if (
        error?.error_type ===
        'TokenException'
      ) {
        res.status(401).json({
          code:
            'ZERODHA_SESSION_EXPIRED',
          message:
            'Your Zerodha session has expired. Please reconnect your account.',
        });

        return;
      }

      next(error);
    }
  };

  holdings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(
        'Holdings route hit'
      );

      if (!req.user) {
        throw new AppError(
          'Unauthorized',
          401
        );
      }

      const brokerAccount =
        await this.zerodhaAuthService.getBrokerAccount(
          req.user.id
        );

      if (!brokerAccount) {
        throw new AppError(
          'Zerodha account not connected',
          404
        );
      }

      console.log(
        'Broker account:',
        brokerAccount
      );

      const client =
        new ZerodhaClient(
          env.zerodhaApiKey,
          brokerAccount.accessToken ??
            undefined
        );

      const holdings =
        await client.getHoldings();

      console.log(
        'Holdings fetched successfully'
      );

      res.status(200).json(
        holdings
      );
    } catch (error: any) {
      console.error(
        'HOLDINGS ERROR:',
        error
      );

      if (
        error?.error_type ===
        'TokenException'
      ) {
        res.status(401).json({
          code:
            'ZERODHA_SESSION_EXPIRED',
          message:
            'Your Zerodha session has expired. Please reconnect your account.',
        });

        return;
      }

      next(error);
    }
  };
  status = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user.id;

      const brokerAccount =
        await prisma.brokerAccount.findFirst({
          where: {
            userId,
          },
          select: {
            broker: true,
            isConnected: true,
            lastSyncedAt: true,
            lastSyncError: true,
          },
        });

      res.status(200).json(
        brokerAccount
      );
    } catch (error) {
      next(error);
    }
  };
}